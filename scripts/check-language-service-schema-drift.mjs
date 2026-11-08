import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const schemaDriftSource = fs.readFileSync(
  path.join(root, 'language-service/src/schema-drift.ts'),
  'utf8',
);

function readVocabulary(name) {
  const match = schemaDriftSource.match(new RegExp(`${name}: \\[([\\s\\S]*?)\\]`));
  if (!match) throw new Error(`Missing ${name} in schema-drift.ts`);
  return [...match[1].matchAll(/'([^']+)'/g)].map((entry) => entry[1]);
}

function readSpec(relativePath) {
  return fs.readFileSync(path.join(root, 'spec/id', relativePath), 'utf8');
}

function sorted(values) {
  return [...new Set(values)].sort();
}

function difference(left, right) {
  const rightSet = new Set(right);
  return sorted(left.filter((value) => !rightSet.has(value)));
}

const structure = readSpec('core/02-document-structure.md');
const rootStructure = structure.match(/## 2\.1 Root Structure([\s\S]*?)## 2\.2/);
if (!rootStructure) throw new Error('Could not locate normative root structure section');
const rootBlock = rootStructure[1].match(/```rg\n([\s\S]*?)```/);
if (!rootBlock) throw new Error('Could not locate normative root structure example');
const specRootSections = sorted(
  [...rootBlock[1].matchAll(/^([A-Za-z][\w]*):(?:[ \t]*.*)?$/gm)].map((entry) => entry[1]),
);

const objectSectionFiles = [
  'geometry/14-geometry-objects.md',
  'geometry/15-composition-objects.md',
  'geometry/16-collection-objects.md',
  'geometry/19-collections.md',
  'presentation/22-dimension.md',
  'presentation/23-annotation.md',
];
const headings = objectSectionFiles.flatMap((file) => {
  const content = readSpec(file);
  return [...content.matchAll(/^##\s+\d+\.\d+\s+([^\n]+)/gm)].map((entry) => ({ file, heading: entry[1] }));
});
const operationSpec = readSpec('geometry/15-composition-objects.md');
const operationBlock = operationSpec.match(
  /## 15\.4 Geometry Operation Objects[\s\S]*?```txt\n([\s\S]*?)```/,
);
if (!operationBlock) throw new Error('Could not locate normative geometry operation object list');
const specOperationTypes = [...operationBlock[1].matchAll(/^([a-z][\w-]*)$/gm)].map((entry) => entry[1]);
const specObjectTypes = sorted(headings.flatMap(({ file, heading }) => {
  const normalized = heading.toLowerCase().trim();
  if (file.endsWith('22-dimension.md')) return ['dimension'];
  if (file.endsWith('23-annotation.md')) return ['annotation'];
  if (file.endsWith('19-collections.md')) return normalized === 'collection' ? ['collection'] : [];
  if (normalized === 'split result as collection') return ['split'];
  if (normalized === 'geometry operation objects' || normalized === 'post-geometry transform pipeline') return [];
  if (normalized.includes('view') || normalized.includes('sheet') || normalized.includes('metadata')) return [];
  return [normalized.split(/\s+|\//)[0]];
}).concat(specOperationTypes));

const expectedRootSections = readVocabulary('rootSections');
const expectedObjectTypes = readVocabulary('objectTypes');
const compatibilityRootAliases = ['styles'];
const rootMissing = difference(expectedRootSections.filter((value) => !compatibilityRootAliases.includes(value)), specRootSections);
const rootExtra = difference(specRootSections, expectedRootSections);
const objectMissing = difference(expectedObjectTypes, specObjectTypes);
const objectExtra = difference(specObjectTypes, expectedObjectTypes);

const sourceFiles = [
  'core/02-document-structure.md',
  ...objectSectionFiles,
  'presentation/25-views-sheets.md',
  'presentation/26-metadata.md',
  'syntax/08-parameters.md',
];
const sourceText = sourceFiles.map((sourceFile) => readSpec(sourceFile)).join('\n');
const expectedFieldVocabulary = sorted([
  ...readVocabulary('parameterFields'),
  ...readVocabulary('viewFields'),
  ...readVocabulary('sheetFields'),
  ...readVocabulary('presentationFields'),
  ...readVocabulary('objectFields'),
]);
const specFieldVocabulary = sorted(expectedFieldVocabulary.filter((field) => (
  new RegExp(`(^|[^A-Za-z0-9_-])${field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=$|[^A-Za-z0-9_-])`, 'm').test(sourceText)
)));
// These editor aliases/extension fields are intentionally code-owned: the
// normative spec describes their semantic family but does not use every
// published compatibility spelling in an example block.
const editorOwnedFields = new Set([
  'shapes', 'step', 'options', 'fontWeight', 'fontStyle', 'non-scaling-stroke',
]);
const fieldMissing = difference(
  expectedFieldVocabulary.filter((field) => !editorOwnedFields.has(field)),
  specFieldVocabulary,
);

const differences = { rootMissing, rootExtra, objectMissing, objectExtra, fieldMissing };
console.log(JSON.stringify({
  specVersion: '0.5',
  sourceFiles: sourceFiles.length,
  expectedRootSections: expectedRootSections.length,
  specRootSections: specRootSections.length,
  expectedObjectTypes: expectedObjectTypes.length,
  specObjectTypes: specObjectTypes.length,
  expectedFieldVocabulary: expectedFieldVocabulary.length,
  specFieldVocabulary: specFieldVocabulary.length,
  differences,
}, null, 2));

if (Object.values(differences).some((items) => items.length > 0)) {
  process.exitCode = 1;
}
