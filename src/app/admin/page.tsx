'use client';

import { useState, useEffect } from 'react';
import LogoutButton from '@/components/LogoutButton';

interface Ticket {
  id: number;
  username: string;
  status: string;
  priority: number;
  date_created: string;
  description: string;
  category: string;
  last_reply?: string;
  date_updated?: string;
  date_finished?: string;
}

interface Task {
  id: number;
  user: string;
  description: string;
  status: string;
  priority: number;
  date_created: string;
  date_updated?: string;
  date_delivered?: string;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'tickets' | 'tasks'>('tickets');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<number | ''>('');
  const [usernameFilter, setUsernameFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [uniqueUsernames, setUniqueUsernames] = useState<string[]>([]);
  const [adminUsers, setAdminUsers] = useState<{ username: string }[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isTaskEditModalOpen, setIsTaskEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    last_reply: '',
    status: ''
  });
  const [taskFormData, setTaskFormData] = useState({
    user: '',
    description: '',
    priority: '1',
    status: 'open',
    date_delivered: ''
  });
  const [taskEditFormData, setTaskEditFormData] = useState({
    user: '',
    description: '',
    priority: '1',
    status: 'open',
    date_delivered: ''
  });

  useEffect(() => {
    if (activeTab === 'tickets') {
      fetchTickets();
    } else {
      fetchTasks();
      fetchAdminUsers();
    }
  }, [activeTab]);

  useEffect(() => {
    const filtered = tickets.filter(ticket => {
      if (statusFilter && ticket.status !== statusFilter) return false;
      if (priorityFilter !== '' && ticket.priority !== priorityFilter) return false;
      if (usernameFilter && ticket.username !== usernameFilter) return false;
      if (searchQuery && !ticket.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
    setFilteredTickets(filtered);
  }, [tickets, statusFilter, priorityFilter, usernameFilter, searchQuery]);

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/tickets/admin');
      const data = await response.json() as Ticket[];
      setTickets(data);
      setFilteredTickets(data);
      
      const usernames = [...new Set(data.map((ticket: Ticket) => ticket.username))];
      setUniqueUsernames(usernames);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    }
  };

  const fetchAdminUsers = async () => {
    try {
      const response = await fetch('/api/users/admin');
      const data = await response.json();
      setAdminUsers(data);
    } catch (error) {
      console.error('Error fetching admin users:', error);
    }
  };

  const handleRowClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setFormData({
      last_reply: ticket.last_reply || '',
      status: ticket.status
    });
    setIsModalOpen(true);
  };

  const handleRowKeyPress = (e: React.KeyboardEvent, ticket: Ticket) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleRowClick(ticket);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    try {
      const response = await fetch(`/api/tickets/${selectedTicket.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          last_reply: formData.last_reply,
          status: formData.status
        }),
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchTickets();
      } else {
        alert('Erro ao atualizar ticket');
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
      alert('Erro ao atualizar ticket');
    }
  };

  const handleTaskStatusChange = async (taskId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus
        }),
      });

      if (response.ok) {
        fetchTasks();
      } else {
        alert('Erro ao atualizar tarefa');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Erro ao atualizar tarefa');
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1: return 'Baixa';
      case 2: return 'Média';
      case 3: return 'Alta';
      default: return 'Não definida';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Aberto';
      case 'pending': return 'Em andamento';
      case 'closed': return 'Concluído';
      default: return status;
    }
  };

  const getTaskStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Aberto';
      case 'pending': return 'Em andamento';
      case 'completed': return 'Concluído';
      default: return status;
    }
  };

  const handleTabClick = (tab: 'tickets' | 'tasks') => {
    setActiveTab(tab);
  };

  const handleKeyPress = (e: React.KeyboardEvent, tab: 'tickets' | 'tasks') => {
    if (e.key === 'Enter' || e.key === ' ') {
      setActiveTab(tab);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...taskFormData,
          date_delivered: taskFormData.date_delivered ? new Date(taskFormData.date_delivered).toISOString() : null
        }),
      });

      if (response.ok) {
        setIsTaskModalOpen(false);
        setTaskFormData({
          user: '',
          description: '',
          priority: '1',
          status: 'open',
          date_delivered: ''
        });
        fetchTasks();
      } else {
        alert('Erro ao criar tarefa');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Erro ao criar tarefa');
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setTaskEditFormData({
      user: task.user,
      description: task.description,
      priority: task.priority.toString(),
      status: task.status,
      date_delivered: task.date_delivered ? new Date(task.date_delivered).toISOString().split('T')[0] : ''
    });
    setIsTaskEditModalOpen(true);
  };

  const handleTaskEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;

    try {
      const response = await fetch(`/api/tasks/${selectedTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: taskEditFormData.status,
          user: taskEditFormData.user,
          description: taskEditFormData.description,
          priority: Number(taskEditFormData.priority),
          date_delivered: taskEditFormData.date_delivered ? new Date(taskEditFormData.date_delivered).toISOString() : null
        }),
      });

      if (response.ok) {
        setIsTaskEditModalOpen(false);
        setSelectedTask(null);
        setTaskEditFormData({
          user: '',
          description: '',
          priority: '1',
          status: 'open',
          date_delivered: ''
        });
        await fetchTasks();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Erro ao atualizar tarefa');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Erro ao atualizar tarefa');
    }
  };

  const handleTaskKeyPress = (e: React.KeyboardEvent, task: Task) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleTaskClick(task);
    }
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData('taskId', task.id.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus
        }),
      });

      if (response.ok) {
        await fetchTasks();
      } else {
        alert('Erro ao atualizar status da tarefa');
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Erro ao atualizar status da tarefa');
    }
  };

  const renderTicketsTab = () => (
    <>
      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Todos</option>
              <option value="open">Aberto</option>
              <option value="pending">Em andamento</option>
              <option value="closed">Concluído</option>
            </select>
          </div>
          <div>
            <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Prioridade
            </label>
            <select
              id="priority-filter"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value ? Number(e.target.value) : '')}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Todas</option>
              <option value="1">Baixa</option>
              <option value="2">Média</option>
              <option value="3">Alta</option>
            </select>
          </div>
          <div>
            <label htmlFor="username-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Usuário
            </label>
            <select
              id="username-filter"
              value={usernameFilter}
              onChange={(e) => setUsernameFilter(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Todos</option>
              {uniqueUsernames.map(username => (
                <option key={username} value={username}>{username}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Buscar por Descrição
            </label>
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Digite para buscar..."
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Lista de Tickets */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {filteredTickets.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">
              {tickets.length === 0 
                ? "Não há tickets cadastrados."
                : "Nenhum ticket encontrado com os filtros selecionados."}
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prioridade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Criação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button
                      type="button"
                      onClick={() => handleRowClick(ticket)}
                      onKeyPress={(e) => handleRowKeyPress(e, ticket)}
                      className="w-full text-left hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                    >
                      {ticket.id}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button
                      type="button"
                      onClick={() => handleRowClick(ticket)}
                      onKeyPress={(e) => handleRowKeyPress(e, ticket)}
                      className="w-full text-left hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                    >
                      {ticket.username}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleRowClick(ticket)}
                      onKeyPress={(e) => handleRowKeyPress(e, ticket)}
                      className="w-full text-left hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                    >
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${ticket.status === 'open' ? 'bg-green-100 text-green-800' : 
                          ticket.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'}`}>
                        {getStatusLabel(ticket.status)}
                      </span>
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleRowClick(ticket)}
                      onKeyPress={(e) => handleRowKeyPress(e, ticket)}
                      className="w-full text-left hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                    >
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${ticket.priority === 1 ? 'bg-blue-100 text-blue-800' : 
                          ticket.priority === 2 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {getPriorityLabel(ticket.priority)}
                      </span>
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      type="button"
                      onClick={() => handleRowClick(ticket)}
                      onKeyPress={(e) => handleRowKeyPress(e, ticket)}
                      className="w-full text-left hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                    >
                      {new Date(ticket.date_created).toLocaleDateString('pt-BR')}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <button
                      type="button"
                      onClick={() => handleRowClick(ticket)}
                      onKeyPress={(e) => handleRowKeyPress(e, ticket)}
                      className="w-full text-left hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                    >
                      {ticket.description}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      type="button"
                      onClick={() => handleRowClick(ticket)}
                      onKeyPress={(e) => handleRowKeyPress(e, ticket)}
                      className="w-full text-left hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                    >
                      {ticket.category}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );

  const renderTasksTab = () => {
    const tasksArray = Array.isArray(tasks) ? tasks : [];
    
    return (
      <>
        <div className="flex justify-end mb-6">
          <button
            type="button"
            onClick={() => setIsTaskModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Criar nova tarefa
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Coluna: Aberto */}
          <div 
            className="bg-gray-50 rounded-lg p-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'open')}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Aberto</h3>
            <div className="space-y-4">
              {tasksArray
                .filter(task => task.status === 'open')
                .map(task => (
                  <button
                    key={task.id}
                    type="button"
                    className="w-full bg-white p-4 rounded-lg shadow cursor-move hover:bg-gray-50 transition-colors duration-150 text-left"
                    onClick={() => handleTaskClick(task)}
                    onKeyPress={(e) => handleTaskKeyPress(e, task)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                        ${task.priority === 1 ? 'bg-blue-100 text-blue-800' : 
                          task.priority === 2 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {getPriorityLabel(task.priority)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{task.description}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{task.user}</span>
                      <span>{new Date(task.date_created).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </button>
                ))}
            </div>
          </div>

          {/* Coluna: Em andamento */}
          <div 
            className="bg-gray-50 rounded-lg p-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'pending')}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Em andamento</h3>
            <div className="space-y-4">
              {tasksArray
                .filter(task => task.status === 'pending')
                .map(task => (
                  <button
                    key={task.id}
                    type="button"
                    className="w-full bg-white p-4 rounded-lg shadow cursor-move hover:bg-gray-50 transition-colors duration-150 text-left"
                    onClick={() => handleTaskClick(task)}
                    onKeyPress={(e) => handleTaskKeyPress(e, task)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                        ${task.priority === 1 ? 'bg-blue-100 text-blue-800' : 
                          task.priority === 2 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {getPriorityLabel(task.priority)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{task.description}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{task.user}</span>
                      <span>{new Date(task.date_created).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </button>
                ))}
            </div>
          </div>

          {/* Coluna: Concluído */}
          <div 
            className="bg-gray-50 rounded-lg p-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'completed')}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Concluído</h3>
            <div className="space-y-4">
              {tasksArray
                .filter(task => task.status === 'completed')
                .map(task => (
                  <button
                    key={task.id}
                    type="button"
                    className="w-full bg-white p-4 rounded-lg shadow cursor-move hover:bg-gray-50 transition-colors duration-150 text-left"
                    onClick={() => handleTaskClick(task)}
                    onKeyPress={(e) => handleTaskKeyPress(e, task)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                        ${task.priority === 1 ? 'bg-blue-100 text-blue-800' : 
                          task.priority === 2 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {getPriorityLabel(task.priority)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{task.description}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{task.user}</span>
                      <span>{new Date(task.date_created).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Modal de Edição de Tarefa */}
        {isTaskEditModalOpen && selectedTask && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Editar Tarefa #{selectedTask.id}</h2>
                <button
                  type="button"
                  onClick={() => setIsTaskEditModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Fechar</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleTaskEdit} className="space-y-6">
                <div>
                  <label htmlFor="edit-task-user" className="block text-sm font-medium text-gray-700">
                    Responsável
                  </label>
                  <select
                    id="edit-task-user"
                    required
                    value={taskEditFormData.user}
                    onChange={(e) => setTaskEditFormData({ ...taskEditFormData, user: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Selecione um responsável</option>
                    {adminUsers.map((admin) => (
                      <option key={admin.username} value={admin.username}>
                        {admin.username}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="edit-task-description" className="block text-sm font-medium text-gray-700">
                    Descrição
                  </label>
                  <textarea
                    id="edit-task-description"
                    required
                    value={taskEditFormData.description}
                    onChange={(e) => setTaskEditFormData({ ...taskEditFormData, description: e.target.value })}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="edit-task-priority" className="block text-sm font-medium text-gray-700">
                    Prioridade
                  </label>
                  <select
                    id="edit-task-priority"
                    required
                    value={taskEditFormData.priority}
                    onChange={(e) => setTaskEditFormData({ ...taskEditFormData, priority: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="1">Baixa</option>
                    <option value="2">Média</option>
                    <option value="3">Alta</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="edit-task-status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="edit-task-status"
                    required
                    value={taskEditFormData.status}
                    onChange={(e) => setTaskEditFormData({ ...taskEditFormData, status: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="open">Aberto</option>
                    <option value="pending">Em andamento</option>
                    <option value="completed">Concluído</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="edit-task-date-delivered" className="block text-sm font-medium text-gray-700">
                    Prazo de Entrega
                  </label>
                  <input
                    type="date"
                    id="edit-task-date-delivered"
                    value={taskEditFormData.date_delivered}
                    onChange={(e) => setTaskEditFormData({ ...taskEditFormData, date_delivered: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsTaskEditModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Nova Tarefa */}
        {isTaskModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Nova Tarefa</h2>
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Fechar</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-6">
                <div>
                  <label htmlFor="task-user" className="block text-sm font-medium text-gray-700">
                    Responsável
                  </label>
                  <select
                    id="task-user"
                    required
                    value={taskFormData.user}
                    onChange={(e) => setTaskFormData({ ...taskFormData, user: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Selecione um responsável</option>
                    {adminUsers.map((admin) => (
                      <option key={admin.username} value={admin.username}>
                        {admin.username}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="task-description" className="block text-sm font-medium text-gray-700">
                    Descrição
                  </label>
                  <textarea
                    id="task-description"
                    required
                    value={taskFormData.description}
                    onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="task-priority" className="block text-sm font-medium text-gray-700">
                    Prioridade
                  </label>
                  <select
                    id="task-priority"
                    required
                    value={taskFormData.priority}
                    onChange={(e) => setTaskFormData({ ...taskFormData, priority: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="1">Baixa</option>
                    <option value="2">Média</option>
                    <option value="3">Alta</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="task-date-delivered" className="block text-sm font-medium text-gray-700">
                    Prazo de Entrega
                  </label>
                  <input
                    type="date"
                    id="task-date-delivered"
                    value={taskFormData.date_delivered}
                    onChange={(e) => setTaskFormData({ ...taskFormData, date_delivered: e.target.value })}
                    min={new Date().toISOString().split('T')[0]} // Não permite datas passadas
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsTaskModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Criar Tarefa
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Área do Administrador
          </h1>
          <LogoutButton />
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              type="button"
              onClick={() => handleTabClick('tickets')}
              onKeyPress={(e) => handleKeyPress(e, 'tickets')}
              className={`${
                activeTab === 'tickets'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Chamados
            </button>
            <button
              type="button"
              onClick={() => handleTabClick('tasks')}
              onKeyPress={(e) => handleKeyPress(e, 'tasks')}
              className={`${
                activeTab === 'tasks'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Tarefas
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'tickets' ? renderTicketsTab() : renderTasksTab()}

        {/* Modal de Detalhes do Ticket */}
        {isModalOpen && selectedTicket && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Detalhes do Ticket #{selectedTicket.id}</h2>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Fechar</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Solicitante
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={selectedTicket.username}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Descrição Original
                  </label>
                  <textarea
                    id="description"
                    value={selectedTicket.description}
                    disabled
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="date-created" className="block text-sm font-medium text-gray-700">
                    Data de Criação
                  </label>
                  <input
                    type="text"
                    id="date-created"
                    value={new Date(selectedTicket.date_created).toLocaleString('pt-BR')}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                {selectedTicket.date_finished && (
                  <div>
                    <label htmlFor="date-finished" className="block text-sm font-medium text-gray-700">
                      Data de Conclusão
                    </label>
                    <input
                      type="text"
                      id="date-finished"
                      value={new Date(selectedTicket.date_finished).toLocaleString('pt-BR')}
                      disabled
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="open">Aberto</option>
                    <option value="pending">Em andamento</option>
                    <option value="closed">Concluído</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="last_reply" className="block text-sm font-medium text-gray-700">
                    Resposta
                  </label>
                  <textarea
                    id="last_reply"
                    required
                    value={formData.last_reply}
                    onChange={(e) => setFormData({ ...formData, last_reply: e.target.value })}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 