import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface StoredCertificate {
  certificateHash: string;
  certificateNumber: string;
  transactionHash: string;
  studentName: string;
  enrollmentNumber: string;
  course: string;
  institution: string;
  issueYear: number;
  issueDate: string;
  studentPhoto?: string;
  certificatePdf?: string;
}

interface AppContextType {
  certificates: StoredCertificate[];
  addCertificate: (cert: StoredCertificate) => void;
  getCertificateByHash: (hash: string) => StoredCertificate | undefined;
  getCertificatesByEnrollment: (enrollment: string) => StoredCertificate[];
  clearCertificates: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const CERTIFICATES_STORAGE_KEY = 'certificates';

export function AppProvider({ children }: { children: ReactNode }) {
  const [certificates, setCertificates] = useState<StoredCertificate[]>(() => {
    try {
      const stored = localStorage.getItem(CERTIFICATES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const addCertificate = (cert: StoredCertificate) => {
    setCertificates((prev) => {
      const hashExists = prev.some(
        (c) => c.certificateHash.toLowerCase() === cert.certificateHash.toLowerCase()
      );

      const numberExists = prev.some(
        (c) => c.certificateNumber.toLowerCase() === cert.certificateNumber.toLowerCase()
      );

      if (hashExists || numberExists) {
        return prev;
      }

      const updated = [...prev, cert];
      localStorage.setItem(CERTIFICATES_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const getCertificateByHash = (hash: string) => {
    return certificates.find(
      (c) => c.certificateHash.toLowerCase() === hash.toLowerCase()
    );
  };

  const getCertificatesByEnrollment = (enrollment: string) => {
    return certificates.filter(
      (c) => c.enrollmentNumber.trim().toLowerCase() === enrollment.trim().toLowerCase()
    );
  };

  const clearCertificates = () => {
    setCertificates([]);
    localStorage.removeItem(CERTIFICATES_STORAGE_KEY);
  };

  return (
    <AppContext.Provider
      value={{
        certificates,
        addCertificate,
        getCertificateByHash,
        getCertificatesByEnrollment,
        clearCertificates
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }

  return context;
}

