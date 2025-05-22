import { listarTestes, type Teste } from "@/lib/db/queries/teste";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TestePage() {
  const registros = await listarTestes();

  // Função para formatar a data
  const formatarData = (data: Date) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container py-10 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Registros de Teste</h1>
        <Button asChild>
          <Link href="/teste/novo">
            <Plus className="mr-2 h-4 w-4" />
            Novo Registro
          </Link>
        </Button>
      </div>

      {registros.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Nenhum registro encontrado.</p>
        </div>
      ) : (
        <Table>
          <TableCaption>Lista de registros de teste</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Data de Criação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registros.map((registro: Teste) => (
              <TableRow key={registro.id}>
                <TableCell>{registro.id}</TableCell>
                <TableCell className="font-medium">{registro.nome}</TableCell>
                <TableCell>{registro.descricao || "-"}</TableCell>
                <TableCell>{formatarData(registro.dataCriacao)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
} 