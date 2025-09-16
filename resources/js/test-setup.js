import '@testing-library/jest-dom'

// Mock do axios para testes
import axios from 'axios'

// Setup global para todos os testes
beforeEach(() => {
  // Limpar mocks antes de cada teste
  jest.clearAllMocks()
})

// Mock global do axios
global.axios = axios