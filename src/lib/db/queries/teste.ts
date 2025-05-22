import { db } from "@/db";
import { teste } from "@/db/schema";
import { desc } from "drizzle-orm";

export type NovoTeste = {
  nome: string;
  descricao: string | null;
};

export type Teste = NovoTeste & {
  id: number;
  dataCriacao: Date;
};


export async function listarTestes(): Promise<Teste[]> {
  return await db.select().from(teste).orderBy(desc(teste.dataCriacao));
}

export async function criarTeste(dados: NovoTeste) {
  return await db.insert(teste).values({
    ...dados,
    dataCriacao: new Date(),
  });
} 