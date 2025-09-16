import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ReportsIndex from '../components/Reports/ReportsIndex'
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

// Mock do Recharts
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => children,
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
}))

import axios from 'axios'

// Mock data
const mockDashboardData = {
  total_clientes: 125,
  total_animais: 280,
  total_veterinarios: 8,
  total_consultas: 1250,
  consultas_mes_atual: 45,
  receita_mes_atual: 15250.75,
  consultas_pendentes: 12,
  procedures_mais_realizados: [
    { nome: 'Consulta de rotina', total: 25, categoria: 'Consulta' },
    { nome: 'Vacinação', total: 20, categoria: 'Prevenção' }
  ]
}

// Wrapper para providers
const TestWrapper = ({ children }) => (
  <AuthProvider>
    <ThemeProvider>
      {children}
    </ThemeProvider>
  </AuthProvider>
)

describe('ReportsIndex Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    axios.get.mockResolvedValue({ data: mockDashboardData })
  })

  it('should render dashboard statistics', async () => {
    render(
      <TestWrapper>
        <ReportsIndex onNavigate={() => {}} />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('125')).toBeInTheDocument()
      expect(screen.getByText('280')).toBeInTheDocument()
      expect(screen.getByText('8')).toBeInTheDocument()
      expect(screen.getByText('1.250')).toBeInTheDocument()
    })
  })

  it('should render report navigation cards', async () => {
    render(
      <TestWrapper>
        <ReportsIndex onNavigate={() => {}} />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('Relatório de Clientes')).toBeInTheDocument()
      expect(screen.getByText('Relatório de Animais')).toBeInTheDocument()
      expect(screen.getByText('Relatório de Veterinários')).toBeInTheDocument()
      expect(screen.getByText('Relatório de Consultas')).toBeInTheDocument()
      expect(screen.getByText('Relatório de Procedimentos')).toBeInTheDocument()
    })
  })

  it('should render charts', async () => {
    render(
      <TestWrapper>
        <ReportsIndex onNavigate={() => {}} />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument()
    })
  })

  it('should display procedures statistics', async () => {
    render(
      <TestWrapper>
        <ReportsIndex onNavigate={() => {}} />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('Procedimentos Mais Realizados')).toBeInTheDocument()
      expect(screen.getByText('Consulta de rotina')).toBeInTheDocument()
      expect(screen.getByText('Vacinação')).toBeInTheDocument()
    })
  })

  it('should handle loading state', () => {
    axios.get.mockImplementation(() => new Promise(() => {})) // Never resolves

    render(
      <TestWrapper>
        <ReportsIndex onNavigate={() => {}} />
      </TestWrapper>
    )

    expect(screen.getByText('Carregando dados...')).toBeInTheDocument()
  })

  it('should handle API error', async () => {
    axios.get.mockRejectedValue(new Error('API Error'))

    render(
      <TestWrapper>
        <ReportsIndex onNavigate={() => {}} />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar dados do dashboard')).toBeInTheDocument()
    })
  })

  it('should format currency correctly', async () => {
    render(
      <TestWrapper>
        <ReportsIndex onNavigate={() => {}} />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('R$ 15.250,75')).toBeInTheDocument()
    })
  })

  it('should call navigation function when report cards are clicked', async () => {
    const mockOnNavigate = vi.fn()

    render(
      <TestWrapper>
        <ReportsIndex onNavigate={mockOnNavigate} />
      </TestWrapper>
    )

    await waitFor(() => {
      const clientCard = screen.getByText('Relatório de Clientes').closest('button')
      clientCard.click()
      expect(mockOnNavigate).toHaveBeenCalledWith('clients')
    })
  })
})