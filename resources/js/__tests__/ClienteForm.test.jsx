import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ClienteForm from '../components/Cliente/ClienteForm'
import { AuthProvider } from '../contexts/AuthContext'
import { ThemeProvider } from '../contexts/ThemeContext'

// Mock do axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
}))

import axios from 'axios'

// Wrapper para providers
const TestWrapper = ({ children }) => (
  <AuthProvider>
    <ThemeProvider>
      {children}
    </ThemeProvider>
  </AuthProvider>
)

describe('ClienteForm Component', () => {
  const mockOnSuccess = vi.fn()
  const mockOnCancel = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render form fields correctly', () => {
    render(
      <TestWrapper>
        <ClienteForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
      </TestWrapper>
    )

    expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    expect(screen.getByLabelText('Telefone')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Endereço')).toBeInTheDocument()
    expect(screen.getByLabelText('Cidade')).toBeInTheDocument()
  })

  it('should handle form submission correctly', async () => {
    axios.post.mockResolvedValue({ data: { id: 1, nome: 'João Silva' } })

    render(
      <TestWrapper>
        <ClienteForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
      </TestWrapper>
    )

    // Preencher formulário
    fireEvent.change(screen.getByLabelText('Nome'), {
      target: { value: 'João Silva' }
    })
    fireEvent.change(screen.getByLabelText('Telefone'), {
      target: { value: '(11) 99999-9999' }
    })
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'joao@example.com' }
    })

    // Submeter formulário
    fireEvent.click(screen.getByText('Salvar'))

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/clientes', {
        nome: 'João Silva',
        telefone: '(11) 99999-9999',
        email: 'joao@example.com',
        endereco: '',
        cidade: ''
      })
      expect(mockOnSuccess).toHaveBeenCalled()
    })
  })

  it('should show validation errors', async () => {
    axios.post.mockRejectedValue({
      response: {
        status: 422,
        data: {
          errors: {
            nome: ['O campo nome é obrigatório.'],
            email: ['O formato do email está inválido.']
          }
        }
      }
    })

    render(
      <TestWrapper>
        <ClienteForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
      </TestWrapper>
    )

    // Submeter formulário vazio
    fireEvent.click(screen.getByText('Salvar'))

    await waitFor(() => {
      expect(screen.getByText('O campo nome é obrigatório.')).toBeInTheDocument()
      expect(screen.getByText('O formato do email está inválido.')).toBeInTheDocument()
    })
  })

  it('should populate form when editing', () => {
    const editData = {
      id: 1,
      nome: 'João Silva',
      telefone: '(11) 99999-9999',
      email: 'joao@example.com',
      endereco: 'Rua das Flores, 123',
      cidade: 'São Paulo'
    }

    render(
      <TestWrapper>
        <ClienteForm
          cliente={editData}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      </TestWrapper>
    )

    expect(screen.getByDisplayValue('João Silva')).toBeInTheDocument()
    expect(screen.getByDisplayValue('(11) 99999-9999')).toBeInTheDocument()
    expect(screen.getByDisplayValue('joao@example.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Rua das Flores, 123')).toBeInTheDocument()
    expect(screen.getByDisplayValue('São Paulo')).toBeInTheDocument()
  })

  it('should call cancel function when cancel button is clicked', () => {
    render(
      <TestWrapper>
        <ClienteForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
      </TestWrapper>
    )

    fireEvent.click(screen.getByText('Cancelar'))

    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('should disable submit button when loading', async () => {
    axios.post.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)))

    render(
      <TestWrapper>
        <ClienteForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
      </TestWrapper>
    )

    fireEvent.change(screen.getByLabelText('Nome'), {
      target: { value: 'João Silva' }
    })

    fireEvent.click(screen.getByText('Salvar'))

    await waitFor(() => {
      expect(screen.getByText('Salvando...')).toBeInTheDocument()
      expect(screen.getByText('Salvando...')).toBeDisabled()
    })
  })
})
