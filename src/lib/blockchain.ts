import { ethers } from 'ethers';

export const CONTRACT_ABI = [
  'event CertificateIssued(string indexed certificateHash, string certificateNumber, string studentName, string enrollmentNumber, string course, uint256 issueDate, address issuerAddress)',
  'event StudentRegistered(string indexed enrollmentNumber, string studentName, uint256 registrationDate)',
  'event CertificateVerified(string indexed certificateHash, bool isValid, uint256 verificationTime)',

  'function registerStudent(string _enrollmentNumber, string _name, string _email, string _mobileNumber, string _department, string _batchYear, string _password) public',
  'function issueCertificate(string _certificateHash, string _certificateNumber, string _enrollmentNumber, string _studentName, string _course, string _institution, uint256 _issueYear, string _ipfsHash) public',

  'function verifyCertificate(string _certificateHash) public returns (bool)',
  'function verifyCertificateView(string _certificateHash) public view returns (bool)',

  'function getCertificate(string _certificateHash) public view returns (string certificateNumber, string studentName, string enrollmentNumber, string course, string institution, uint256 issueYear, uint256 issueDate, string ipfsHash, address issuerAddress)',
  'function getStudent(string _enrollmentNumber) public view returns (string name, string email, string mobileNumber, string department, string batchYear, bool isRegistered, uint256 registrationDate)',
  'function verifyStudentLogin(string _enrollmentNumber, string _password) public view returns (bool)',
  'function getStudentCertificates(string _enrollmentNumber) public view returns (string[])',
  'function getAllCertificateHashes() public view returns (string[])',
  'function getAllEnrollmentNumbers() public view returns (string[])',
  'function getTotalCertificates() public view returns (uint256)',
  'function getAdmin() public view returns (address)',
  'function isAdmin() public view returns (bool)',
  'function admin() public view returns (address)',
  'function totalCertificates() public view returns (uint256)',
  'function isCertificateNumberExists(string _certificateNumber) public view returns (bool)'
];

export const DEFAULT_CONTRACT_ADDRESS = '0x99d7FedF6906d83974FC030dC699074bF5C33b1a';
export const ADMIN_WALLET_ADDRESS = '0xbC165a95C0D0d9918a890b3F96A286E86B961cC5';

interface ViteEnv {
  VITE_SEPOLIA_RPC_URL?: string;
}

export const SEPOLIA_RPC_URL =
  (import.meta.env as ViteEnv).VITE_SEPOLIA_RPC_URL ||
  'https://ethereum-sepolia-rpc.publicnode.com';
export const SEPOLIA_CHAIN_ID = 11155111;
export const SEPOLIA_CHAIN_ID_HEX = '0xaa36a7';

export interface Certificate {
  certificateNumber: string;
  studentName: string;
  enrollmentNumber: string;
  course: string;
  institution: string;
  issueYear: number;
  issueDate: number;
  certificateHash: string;
  ipfsHash: string;
  issuerAddress: string;
}

export interface Student {
  name: string;
  email: string;
  mobileNumber: string;
  department: string;
  batchYear: string;
  isRegistered: boolean;
  registrationDate: number;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

export class BlockchainService {
  private provider:
    | ethers.providers.Web3Provider
    | ethers.providers.JsonRpcProvider
    | null = null;

  private signer: ethers.Signer | null = null;
  private contract: ethers.Contract | null = null;
  private contractAddress = '';

  async connectWallet(): Promise<string> {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed! Please install MetaMask extension.');
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No wallet account was approved in MetaMask.');
      }

      const approvedAccounts = await window.ethereum.request({
        method: 'eth_accounts'
      });

      if (!approvedAccounts || approvedAccounts.length === 0) {
        throw new Error('MetaMask did not expose any approved accounts.');
      }

      let chainId = await window.ethereum.request({ method: 'eth_chainId' });
      console.log('Connected to Chain ID:', chainId);

      if (chainId !== SEPOLIA_CHAIN_ID_HEX) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }]
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: SEPOLIA_CHAIN_ID_HEX,
                  chainName: 'Sepolia Testnet',
                  nativeCurrency: {
                    name: 'SepoliaETH',
                    symbol: 'SepoliaETH',
                    decimals: 18
                  },
                  rpcUrls: [SEPOLIA_RPC_URL]
                }
              ]
            });
          } else {
            throw new Error('Please switch MetaMask to Sepolia network manually.');
          }
        }

        chainId = await window.ethereum.request({ method: 'eth_chainId' });

        if (chainId !== SEPOLIA_CHAIN_ID_HEX) {
          throw new Error('MetaMask is not connected to Sepolia (Chain ID 11155111).');
        }
      }

      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();

      const address = await this.signer.getAddress();
      console.log('Connected wallet address:', address);

      if (!address) {
        throw new Error('Failed to get connected wallet address.');
      }

      return address;
    } catch (error: any) {
      this.reset();
      throw new Error(`Failed to connect wallet: ${error.message}`);
    }
  }

  isAdminWallet(walletAddress: string): boolean {
    return walletAddress.toLowerCase() === ADMIN_WALLET_ADDRESS.toLowerCase();
  }

  async initContract(contractAddress: string): Promise<void> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    this.contractAddress = contractAddress;
    this.contract = new ethers.Contract(contractAddress, CONTRACT_ABI, this.signer);
  }

  async isAdmin(): Promise<boolean> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }
    return await this.contract.isAdmin();
  }

  async getAdminAddress(): Promise<string> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }
    return await this.contract.admin();
  }

  async registerStudent(
    enrollmentNumber: string,
    name: string,
    email: string,
    mobileNumber: string,
    department: string,
    batchYear: string,
    password: string
  ): Promise<ethers.ContractTransaction> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    return await this.contract.registerStudent(
      enrollmentNumber,
      name,
      email,
      mobileNumber,
      department,
      batchYear,
      password
    );
  }

  async issueCertificate(
    certificateHash: string,
    certificateNumber: string,
    enrollmentNumber: string,
    studentName: string,
    course: string,
    institution: string,
    issueYear: number,
    ipfsHash: string = ''
  ): Promise<ethers.ContractTransaction> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    return await this.contract.issueCertificate(
      certificateHash,
      certificateNumber,
      enrollmentNumber,
      studentName,
      course,
      institution,
      issueYear,
      ipfsHash
    );
  }

  async verifyCertificate(certificateHash: string): Promise<boolean> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }
    return await this.contract.verifyCertificateView(certificateHash);
  }

  async getCertificate(certificateHash: string): Promise<Certificate> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    const result = await this.contract.getCertificate(certificateHash);

    return {
      certificateNumber: result.certificateNumber,
      studentName: result.studentName,
      enrollmentNumber: result.enrollmentNumber,
      course: result.course,
      institution: result.institution,
      issueYear: result.issueYear.toNumber(),
      issueDate: result.issueDate.toNumber(),
      certificateHash,
      ipfsHash: result.ipfsHash,
      issuerAddress: result.issuerAddress
    };
  }

  async getStudent(enrollmentNumber: string): Promise<Student> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    const result = await this.contract.getStudent(enrollmentNumber);

    return {
      name: result.name,
      email: result.email,
      mobileNumber: result.mobileNumber,
      department: result.department,
      batchYear: result.batchYear,
      isRegistered: result.isRegistered,
      registrationDate: result.registrationDate.toNumber()
    };
  }

  async isCertificateNumberExists(certificateNumber: string): Promise<boolean> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }
    return await this.contract.isCertificateNumberExists(certificateNumber);
  }

  async verifyStudentLogin(
    enrollmentNumber: string,
    password: string
  ): Promise<boolean> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }
    return await this.contract.verifyStudentLogin(enrollmentNumber, password);
  }

  async getStudentCertificates(enrollmentNumber: string): Promise<string[]> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }
    return await this.contract.getStudentCertificates(enrollmentNumber);
  }

  async getAllCertificateHashes(): Promise<string[]> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }
    return await this.contract.getAllCertificateHashes();
  }

  async getAllEnrollmentNumbers(): Promise<string[]> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }
    return await this.contract.getAllEnrollmentNumbers();
  }

  async getTotalCertificates(): Promise<number> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    const total = await this.contract.getTotalCertificates();
    return total.toNumber();
  }

  getContractAddress(): string {
    return this.contractAddress;
  }

  async getConnectedAddress(): Promise<string | null> {
    if (!this.signer) return null;
    return await this.signer.getAddress();
  }

  async getNetwork(): Promise<ethers.providers.Network | null> {
    if (!this.provider) return null;
    return await this.provider.getNetwork();
  }

  reset(): void {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.contractAddress = '';
  }
}

export const blockchainService = new BlockchainService();

export async function generateCertificateHash(data: {
  studentName: string;
  enrollmentNumber: string;
  course: string;
  institution: string;
  issueYear: number;
}): Promise<string> {
  const str = JSON.stringify(data) + Date.now().toString();
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return '0x' + hashHex;
}
