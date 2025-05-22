import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { criarTeste } from "@/lib/db/queries/teste";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function handleSubmit(formData: FormData) {
  'use server'
  
  const nome = formData.get('nome') as string;
  const descricao = formData.get('descricao') as string;

  await criarTeste({
    nome,
    descricao: descricao || null,
  });
  
  revalidatePath('/teste');
  redirect('/teste');
}

export default function NovoTestePage() {
  return (
    <div className="container py-10">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/teste">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Novo Registro de Teste</CardTitle>
          <CardDescription>
            Adicione um novo registro à tabela de teste.
          </CardDescription>
        </CardHeader>
        <form action={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" name="nome" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea id="descricao" name="descricao" rows={4} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href="/teste">Cancelar</Link>
            </Button>
            <Button type="submit">Salvar</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 