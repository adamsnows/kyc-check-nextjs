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
  // Gera um array de números de página para exibir
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Se o total de páginas for pequeno, mostre todas
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Algoritmo para mostrar números de página ao redor da página atual
      const halfMaxPages = Math.floor(maxPagesToShow / 2);
      let startPage = Math.max(currentPage - halfMaxPages, 1);
      let endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

      // Ajustar se estamos próximos do final
      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(endPage - maxPagesToShow + 1, 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Adicionar elipses
      if (startPage > 1) {
        pageNumbers.unshift(-1); // Usar -1 como marcador para "..."
        pageNumbers.unshift(1);
      }

      if (endPage < totalPages) {
        pageNumbers.push(-2); // Usar -2 como outro marcador para "..."
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <Flex justifyContent="between" className="items-center">
      <Text className="text-xs text-gray-500 dark:text-gray-400">
        Página {currentPage} de {totalPages}
      </Text>

      <Flex className="space-x-1">
        <Button
          size="xs"
          variant="light"
          color="gray"
          icon={() => <span aria-hidden="true">«</span>}
          disabled={currentPage <= 1}
          onClick={() => onPageChange(1)}
          tooltip="Primeira página"
        />

        <Button
          size="xs"
          variant="light"
          color="gray"
          icon={() => <span aria-hidden="true">‹</span>}
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          tooltip="Página anterior"
        />

        {pageNumbers.map((pageNumber, index) => {
          if (pageNumber === -1 || pageNumber === -2) {
            // Renderiza elipses
            return <span key={`ellipsis-${index}`} className="px-2 text-gray-500">...</span>;
          }

          return (
            <Button
              key={pageNumber}
              size="xs"
              variant={currentPage === pageNumber ? "primary" : "light"}
              color={currentPage === pageNumber ? "blue" : "gray"}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </Button>
          );
        })}

        <Button
          size="xs"
          variant="light"
          color="gray"
          icon={() => <span aria-hidden="true">›</span>}
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          tooltip="Próxima página"
        />

        <Button
          size="xs"
          variant="light"
          color="gray"
          icon={() => <span aria-hidden="true">»</span>}
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(totalPages)}
          tooltip="Última página"
        />
      </Flex>
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
    <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Title className="text-base font-medium">Histórico de Validações</Title>
          <Text className="text-xs text-gray-500 dark:text-gray-400">
            {pagination && `Mostrando ${validations.length} de ${pagination.total} registros`}
          </Text>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHead>
            <TableRow className="bg-gray-50 dark:bg-gray-800">
              <TableHeaderCell className="text-xs">Data</TableHeaderCell>
              <TableHeaderCell className="text-xs">Usuário</TableHeaderCell>
              <TableHeaderCell className="text-xs">Documento</TableHeaderCell>
              <TableHeaderCell className="text-xs">Resultado</TableHeaderCell>
              <TableHeaderCell className="text-xs">Similaridade</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {validations.length > 0 ? (
              validations.map((validation) => (
                <TableRow key={validation._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
                  <TableCell className="text-xs font-medium">{formatDate(validation.createdAt)}</TableCell>
                  <TableCell className="text-xs">{validation.userName || 'Não informado'}</TableCell>
                  <TableCell className="text-xs">{validation.documentType || 'Não informado'}</TableCell>
                  <TableCell>
                    <Badge color={validation.isMatch ? 'green' : 'red'} size="xs">
                      {validation.isMatch ? 'Match' : 'Sem Match'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-medium">
                    <span
                      className={`${validation.similarity >= 0.7
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'}`}
                    >
                      {(validation.similarity * 100).toFixed(2)}%
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Text className="text-gray-500 dark:text-gray-400">
                    Nenhuma validação encontrada
                  </Text>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && pagination.pages > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </Card>
  );
}
