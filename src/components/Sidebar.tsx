
import { useState, useEffect } from "react";
import { Document, Folder, getAllDocuments, getAllFolders } from "@/utils/localStorage";
import DocumentList from "./DocumentList";
import ThemeSwitcher from "./ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeft } from "lucide-react";

interface SidebarProps {
  currentDocument: Document | null;
  onDocumentCreate: (doc: Document) => void;
  onDocumentSelect: (doc: Document) => void;
}

export default function Sidebar({ currentDocument, onDocumentCreate, onDocumentSelect }: SidebarProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const refreshData = () => {
    setDocuments(getAllDocuments());
    setFolders(getAllFolders());
  };
  
  // Initialize data
  useEffect(() => {
    refreshData();
  }, []);
  
  return (
    <div 
      className={`bg-sidebar relative border-r border-sidebar-border h-screen flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-12" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && <h2 className="font-serif font-semibold text-lg">Mindful Writer</h2>}
        <Button 
          variant="ghost" 
          size="sm" 
          className="ml-auto p-1 h-8 w-8"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
        </Button>
      </div>
      
      {!isCollapsed && (
        <>
          <div className="flex-1 overflow-y-auto">
            <DocumentList
              currentDocumentId={currentDocument?.id}
              onDocumentCreate={onDocumentCreate}
              onDocumentSelect={onDocumentSelect}
              documents={documents}
              folders={folders}
              refreshData={refreshData}
            />
          </div>
          <div className="border-t border-sidebar-border p-2 flex justify-end">
            <ThemeSwitcher />
          </div>
        </>
      )}
    </div>
  );
}
