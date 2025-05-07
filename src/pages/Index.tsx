
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Editor from "@/components/Editor";
import Sidebar from "@/components/Sidebar";
import ShareModal from "@/components/ShareModal";
import { Document, getCurrentDocument, setCurrentDocument, getDocumentById, Theme, getTheme } from "@/utils/localStorage";

const Index = () => {
  const [document, setDocument] = useState<Document | null>(null);
  const [searchParams] = useSearchParams();
  
  // Apply theme on component mount
  useEffect(() => {
    const theme: Theme = getTheme();
    document.documentElement.classList.remove('light', 'dark', 'solarized-light', 'solarized-dark');
    document.documentElement.classList.add(theme);
  }, []);
  
  // Load document from URL params or from localStorage
  useEffect(() => {
    const sharedDocumentId = searchParams.get('documentId');
    
    if (sharedDocumentId) {
      const sharedDocument = getDocumentById(sharedDocumentId);
      if (sharedDocument) {
        setDocument(sharedDocument);
        return;
      }
    }
    
    const currentDocument = getCurrentDocument();
    if (currentDocument) {
      setDocument(currentDocument);
    }
  }, [searchParams]);
  
  const handleDocumentCreate = (doc: Document) => {
    setCurrentDocument(doc.id);
    setDocument(doc);
  };
  
  const handleDocumentSelect = (doc: Document) => {
    setDocument(doc);
  };
  
  const handleDocumentChange = (updatedDoc: Document) => {
    setDocument(updatedDoc);
  };
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        currentDocument={document}
        onDocumentCreate={handleDocumentCreate}
        onDocumentSelect={handleDocumentSelect}
      />
      
      <div className="flex-1 flex flex-col overflow-y-auto">
        {document && (
          <div className="sticky top-0 z-10 flex justify-end p-2 bg-background/80 backdrop-blur-sm border-b">
            <ShareModal documentId={document.id} documentTitle={document.title} />
          </div>
        )}
        
        <Editor document={document} onDocumentChange={handleDocumentChange} />
      </div>
    </div>
  );
};

export default Index;
