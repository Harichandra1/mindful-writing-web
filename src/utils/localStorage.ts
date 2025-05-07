
export interface Document {
  id: string;
  title: string;
  content: string;
  folderId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Folder {
  id: string;
  name: string;
  createdAt: string;
}

const DOCUMENTS_KEY = 'mindful-writer-documents';
const FOLDERS_KEY = 'mindful-writer-folders';
const CURRENT_DOCUMENT_KEY = 'mindful-writer-current-document';
const THEME_KEY = 'mindful-writer-theme';

// Document functions
export const getAllDocuments = (): Document[] => {
  const documents = localStorage.getItem(DOCUMENTS_KEY);
  return documents ? JSON.parse(documents) : [];
};

export const getDocumentById = (id: string): Document | undefined => {
  const documents = getAllDocuments();
  return documents.find(doc => doc.id === id);
};

export const saveDocument = (document: Document): void => {
  const documents = getAllDocuments();
  const index = documents.findIndex(doc => doc.id === document.id);
  
  if (index !== -1) {
    documents[index] = {
      ...document,
      updatedAt: new Date().toISOString()
    };
  } else {
    documents.push({
      ...document,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  
  localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(documents));
};

export const deleteDocument = (id: string): void => {
  const documents = getAllDocuments();
  const filteredDocuments = documents.filter(doc => doc.id !== id);
  localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(filteredDocuments));
  
  // If current document is deleted, clear current document
  const currentDocument = getCurrentDocument();
  if (currentDocument?.id === id) {
    clearCurrentDocument();
  }
};

// Folder functions
export const getAllFolders = (): Folder[] => {
  const folders = localStorage.getItem(FOLDERS_KEY);
  return folders ? JSON.parse(folders) : [];
};

export const getFolderById = (id: string): Folder | undefined => {
  const folders = getAllFolders();
  return folders.find(folder => folder.id === id);
};

export const saveFolder = (folder: Folder): void => {
  const folders = getAllFolders();
  const index = folders.findIndex(f => f.id === folder.id);
  
  if (index !== -1) {
    folders[index] = folder;
  } else {
    folders.push({
      ...folder,
      createdAt: new Date().toISOString()
    });
  }
  
  localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
};

export const deleteFolder = (id: string): void => {
  const folders = getAllFolders();
  const filteredFolders = folders.filter(folder => folder.id !== id);
  localStorage.setItem(FOLDERS_KEY, JSON.stringify(filteredFolders));
  
  // Update documents in this folder to have no folder
  const documents = getAllDocuments();
  const updatedDocuments = documents.map(doc => {
    if (doc.folderId === id) {
      return { ...doc, folderId: null, updatedAt: new Date().toISOString() };
    }
    return doc;
  });
  
  localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(updatedDocuments));
};

// Current document functions
export const getCurrentDocument = (): Document | undefined => {
  const currentDocumentId = localStorage.getItem(CURRENT_DOCUMENT_KEY);
  if (!currentDocumentId) return undefined;
  
  return getDocumentById(currentDocumentId);
};

export const setCurrentDocument = (documentId: string): void => {
  localStorage.setItem(CURRENT_DOCUMENT_KEY, documentId);
};

export const clearCurrentDocument = (): void => {
  localStorage.removeItem(CURRENT_DOCUMENT_KEY);
};

// Theme functions
export type Theme = 'light' | 'dark' | 'solarized-light' | 'solarized-dark';

export const getTheme = (): Theme => {
  return (localStorage.getItem(THEME_KEY) as Theme) || 'light';
};

export const setTheme = (theme: Theme): void => {
  localStorage.setItem(THEME_KEY, theme);
};
