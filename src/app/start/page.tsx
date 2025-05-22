import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Terminal, Rocket, Target, Book, Code2, Package, GitFork, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function StartPage() {
  return (
    <div className="container py-10 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl flex items-center gap-2">
            <Rocket className="h-8 w-8" />
            GTech Day - Sistema de Tickets e Tarefas
          </CardTitle>
          <CardDescription>
            MVP de sistema de gerenciamento de tickets e tarefas com duas visões distintas: Cliente e Admin
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Objetivo do Projeto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Construir uma aplicação MVP utilizando Cursor (IA/copilot) como ferramenta principal para gerar telas e lógica
              inicial, focando em acelerar o desenvolvimento de interfaces e funcionalidades reais, conectadas a um banco de dados funcional.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Stack Tecnológica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Next.js</Badge>
              <Badge variant="outline">PostgreSQL</Badge>
              <Badge variant="outline">Drizzle ORM</Badge>
              <Badge variant="outline">Tailwind CSS</Badge>
              <Badge variant="outline">Shadcn/UI</Badge>
              <Badge variant="outline">pnpm</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            Funcionalidades Principais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="login">
              <AccordionTrigger>Login</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc list-inside space-y-2">
                  <li>Tela simples de login</li>
                  <li>Redirecionamento baseado no perfil (cliente/admin)</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="cliente">
              <AccordionTrigger>Visão Cliente</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">1. Abrir Chamado/Suporte</h4>
                    <ul className="list-disc list-inside ml-4">
                      <li>Nome do solicitante</li>
                      <li>Descrição do problema</li>
                      <li>Categoria (dropdown)</li>
                      <li>Prioridade (baixa, média, alta)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium">2. Consultar Tickets</h4>
                    <ul className="list-disc list-inside ml-4">
                      <li>Grid com ID, status, prioridade, data de criação</li>
                      <li>Filtros por status e prioridade</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="admin">
              <AccordionTrigger>Visão Admin</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">1. Visualizar Tickets</h4>
                    <ul className="list-disc list-inside ml-4">
                      <li>Grid com filtros (status, cliente, prioridade)</li>
                      <li>Busca por descrição</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium">2. Responder Tickets</h4>
                    <ul className="list-disc list-inside ml-4">
                      <li>Campo para resposta</li>
                      <li>Alteração de status</li>
                      <li>Data de resposta automática</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium">3. Criar Tarefas</h4>
                    <ul className="list-disc list-inside ml-4">
                      <li>Criador</li>
                      <li>Descrição</li>
                      <li>Prioridade</li>
                      <li>Prazo de entrega</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium">4. Kanban</h4>
                    <ul className="list-disc list-inside ml-4">
                      <li>Colunas: Aberto / Em andamento / Concluído</li>
                      <li>Atualização em tempo real/refresh</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Comandos Úteis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Instalação:</p>
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                  pnpm install
                </code>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Desenvolvimento:</p>
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                  pnpm dev
                </code>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Database:</p>
                <div className="space-y-2">
                  <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm block">
                    pnpm drizzle-kit generate
                  </code>
                  <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm block">
                    pnpm drizzle-kit push
                  </code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Sistema de Pontuação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Cliente: Abrir suporte</span>
                <Badge>10 pontos</Badge>
              </div>
              <div className="flex justify-between">
                <span>Cliente: Consultar tickets</span>
                <Badge>10 pontos</Badge>
              </div>
              <div className="flex justify-between">
                <span>Admin: Consultar tickets</span>
                <Badge>10 pontos</Badge>
              </div>
              <div className="flex justify-between">
                <span>Admin: Responder ticket</span>
                <Badge>10 pontos</Badge>
              </div>
              <div className="flex justify-between">
                <span>Admin: Gerar task</span>
                <Badge>10 pontos</Badge>
              </div>
              <div className="flex justify-between">
                <span>Admin: Quadro kanban</span>
                <Badge>10 pontos</Badge>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Bônus: Zero-shot AI Challenge</span>
                <Badge variant="secondary">50 pontos</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      
    </div>
  );
} 