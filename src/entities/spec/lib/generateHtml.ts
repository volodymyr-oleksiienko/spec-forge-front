import { renderTypeMetadata, type SpecTable } from '@/entities/spec';

export const generateHtml = (specTable: SpecTable): string => {
  const maxDepth = specTable.specRows.reduce((max, row) => Math.max(max, row.depth), 0);

  const headRow = `<tr>
            ${`<th>Property</th>`.repeat(maxDepth + 1)}
            <th>Type</th>
            <th>Format</th>
            <th>Required</th>
            <th>Description</th>
        </tr>`;

  const bodyRows = specTable.specRows
    .map((row) => {
      const propertyCells = Array.from({ length: maxDepth }, (_, i) => {
        return `<td>${i === row.depth ? escapeHtml(row.name) : ''}</td>`;
      }).join('');

      const typeCell = `<td>${row.type.type.toLowerCase()}${escapeHtml(renderTypeMetadata(row.type))}</td>`;
      const reqCell = `<td>${row.required ? 'Yes' : 'No'}</td>`;
      const descCell = `<td>${escapeHtml(row.description || '')}</td>`;

      return `<tr>${propertyCells}${typeCell}${reqCell}${descCell}</tr>`;
    })
    .join('\n');

  return `
    <table>
      <thead>${headRow}</thead>
      <tbody>${bodyRows}</tbody>
    </table>`;
};

const escapeHtml = (s: string | undefined | null): string => {
  if (!s) return '';
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};
