import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';

function DataTable({ columns, data, loading, emptyMessage = 'Nenhum registo encontrado', onRowClick }) {
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="warning" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <div className="text-center py-5 text-secondary">{emptyMessage}</div>;
  }

  return (
    <Table hover responsive className="rc-table rc-card mb-0">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key} className="text-muted text-uppercase small">
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr
            key={item.id}
            className={onRowClick ? 'rc-clickable-row' : ''}
            onClick={() => onRowClick && onRowClick(item)}
          >
            {columns.map((column) => (
              <td key={column.key}>{column.render ? column.render(item) : item[column.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default DataTable;
