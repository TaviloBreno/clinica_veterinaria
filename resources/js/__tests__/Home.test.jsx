import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Home from '../pages/Home'
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

// Mock data
const mockReportsData = {
  total_clientes: 125,
  total_animais: 280,
  total_veterinarios: 8,
  total_consultas: 1250,
  consultas_mes_atual: 45,
  receita_mes_atual: 15250.75,
  consultas_pendentes: 12
}

// Wrapper para providers
const TestWrapper = ({ children }) => (
  <AuthProvider>
    <ThemeProvider>
      {children}
    </ThemeProvider>
  </AuthProvider>
)

describe('Home Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    axios.get.mockResolvedValue({ data: mockReportsData })
  })

  it('should render loading state initially', () => {
    render(
      <TestWrapper>
        <Home onNavigate={() => {}} onNavigateToReports={() => {}} />
      </TestWrapper>
    )

    expect(screen.getByText('Carregando estatísticas...')).toBeInTheDocument()
  })

  it('should display statistics after loading', async () => {
    render(
      <TestWrapper>
        <Home onNavigate={() => {}} onNavigateToReports={() => {}} />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('125')).toBeInTheDocument() // total_clientes
      expect(screen.getByText('280')).toBeInTheDocument() // total_animais
      expect(screen.getByText('8')).toBeInTheDocument() // total_veterinarios
      expect(screen.getByText('1.250')).toBeInTheDocument() // total_consultas
    })
  })

  it('should format currency correctly', async () => {
    render(
      <TestWrapper>
        <Home onNavigate={() => {}} onNavigateToReports={() => {}} />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('R$ 15.250,75')).toBeInTheDocument()
    })
  })

  it('should display quick action cards', async () => {
    render(
      <TestWrapper>
        <Home onNavigate={() => {}} onNavigateToReports={() => {}} />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('Novo Cliente')).toBeInTheDocument()
      expect(screen.getByText('Novo Animal')).toBeInTheDocument()
      expect(screen.getByText('Nova Consulta')).toBeInTheDocument()
      expect(screen.getByText('Novo Veterinário')).toBeInTheDocument()
    })
  })

  it('should display reports section', async () => {
    render(
      <TestWrapper>
        <Home onNavigate={() => {}} onNavigateToReports={() => {}} />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('Relatórios')).toBeInTheDocument()
      expect(screen.getByText('Relatório de Clientes')).toBeInTheDocument()
      expect(screen.getByText('Relatório de Animais')).toBeInTheDocument()
      expect(screen.getByText('Relatório de Consultas')).toBeInTheDocument()
    })
  })

  it('should handle API error gracefully', async () => {
    axios.get.mockRejectedValue(new Error('API Error'))

    render(
      <TestWrapper>
        <Home onNavigate={() => {}} onNavigateToReports={() => {}} />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar estatísticas')).toBeInTheDocument()
    })
  })

  it('should call navigation functions when cards are clicked', async () => {
    const mockOnNavigate = vi.fn()
    const mockOnNavigateToReports = vi.fn()

    render(
      <TestWrapper>
        <Home onNavigate={mockOnNavigate} onNavigateToReports={mockOnNavigateToReports} />
      </TestWrapper>
    )

    await waitFor(() => {
      const clienteCard = screen.getByText('Novo Cliente').closest('button')
      clienteCard.click()
      expect(mockOnNavigate).toHaveBeenCalledWith('clientes')
    })
  })
})
