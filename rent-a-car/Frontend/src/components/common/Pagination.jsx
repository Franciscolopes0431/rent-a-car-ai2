import { Pagination as BSPagination, Form, Row, Col } from 'react-bootstrap';

function Pagination({ pagination, onPageChange, onPageSizeChange }) {
  const { page, pageSize, total, totalPages } = pagination;

  return (
    <div className="rc-pagination rc-card p-3 mt-3">
      <Row className="align-items-center gy-2">
        <Col xs="auto">
          <BSPagination className="mb-0">
            <BSPagination.First disabled={page === 1} onClick={() => onPageChange(1)} />
            <BSPagination.Prev disabled={page === 1} onClick={() => onPageChange(page - 1)} />
            <BSPagination.Item active>{page}</BSPagination.Item>
            <BSPagination.Next disabled={page === totalPages || totalPages === 0} onClick={() => onPageChange(page + 1)} />
            <BSPagination.Last disabled={page === totalPages || totalPages === 0} onClick={() => onPageChange(totalPages)} />
          </BSPagination>
        </Col>
        <Col xs="auto" className="text-muted">
          {total} resultados
        </Col>
        <Col xs="auto">
          <Form.Select value={pageSize} onChange={(event) => onPageSizeChange(Number(event.target.value))}>
            {[10, 25, 50].map((size) => (
              <option key={size} value={size}>
                {size} / página
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>
    </div>
  );
}

export default Pagination;
