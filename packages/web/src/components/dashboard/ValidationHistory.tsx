import React from 'react';
import {
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Badge,
  Text,
  Card,
  Title,
  Flex,
  Button,
} from '@tremor/react';

interface ValidationHistoryItem {
  _id: string;
  isMatch: boolean;
  similarity: number;
  userName?: string;
  documentType?: string;
  createdAt: string;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <Flex justifyContent="center" className="mt-4 space-x-2">
      <Button
        size="xs"
        variant="secondary"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Anterior
      </Button>
      
      <Text>
        Página {currentPage} de {totalPages}
      </Text>
      
      <Button
        size="xs"
        variant="secondary"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Próxima
      </Button>
    </Flex>
  );
}

interface ValidationHistoryProps {
  validations: ValidationHistoryItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  } | null;
  onPageChange: (page: number) => void;
}

export default function ValidationHistory({
  validations,
  pagination,
  onPageChange,
}: ValidationHistoryProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };

  return (
    <Card className="mt-6">
      <Title>Histórico de Validações</Title>
      
      <Table className="mt-4">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Data</TableHeaderCell>
            <TableHeaderCell>Usuário</TableHeaderCell>
            <TableHeaderCell>Documento</TableHeaderCell>
            <TableHeaderCell>Resultado</TableHeaderCell>
            <TableHeaderCell>Similaridade</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {validations.length > 0 ? (
            validations.map((validation) => (
              <TableRow key={validation._id}>
                <TableCell>{formatDate(validation.createdAt)}</TableCell>
                <TableCell>{validation.userName || 'Não informado'}</TableCell>
                <TableCell>{validation.documentType || 'Não informado'}</TableCell>
                <TableCell>
                  <Badge color={validation.isMatch ? 'green' : 'red'}>
                    {validation.isMatch ? 'Match' : 'Sem Match'}
                  </Badge>
                </TableCell>
                <TableCell>{(validation.similarity * 100).toFixed(2)}%</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Nenhuma validação encontrada
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {pagination && pagination.pages > 0 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={onPageChange}
        />
      )}
    </Card>
  );
}
