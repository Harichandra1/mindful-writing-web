
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { File, Folder as FolderIcon, Plus, Trash, MoreVertical } from "lucide-react";
import { Document, Folder, getAllDocuments, getAllFolders, saveDocument, saveFolder, deleteDocument, deleteFolder, setCurrentDocument } from "@/utils/localStorage";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';

interface DocumentListProps {
  currentDocumentId: string | undefined;
  onDocumentCreate: (doc: Document) => void;
  onDocumentSelect: (doc: Document) => void;
  documents: Document[];
  folders: Folder[];
  refreshData: () => void;
}

export default function DocumentList({ 
  currentDocumentId,
  onDocumentCreate, 
  onDocumentSelect,
  documents,
  folders,
  refreshData
}: DocumentListProps) {
  const [newDocumentDialog, setNewDocumentDialog] = useState(false);
  const [newFolderDialog, setNewFolderDialog] = useState(false);
  const [newDocumentName, setNewDocumentName] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  
  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };
  
  const handleCreateDocument = () => {
    if (!newDocumentName.trim()) {
      toast({ title: "Document name is required", variant: "destructive" });
      return;
    }
    
    const newDocument: Document = {
      id: uuidv4(),
      title: newDocumentName,
      content: "",
      folderId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    saveDocument(newDocument);
    setNewDocumentName("");
    setNewDocumentDialog(false);
    toast({ title: "Document created" });
    onDocumentCreate(newDocument);
    refreshData();
  };
  
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      toast({ title: "Folder name is required", variant: "destructive" });
      return;
    }
    
    const newFolder: Folder = {
      id: uuidv4(),
      name: newFolderName,
      createdAt: new Date().toISOString()
    };
    
    saveFolder(newFolder);
    setNewFolderName("");
    setNewFolderDialog(false);
    toast({ title: "Folder created" });
    refreshData();
  };
  
  const handleDeleteDocument = (id: string) => {
    deleteDocument(id);
    toast({ title: "Document deleted" });
    refreshData();
  };
  
  const handleDeleteFolder = (id: string) => {
    deleteFolder(id);
    toast({ title: "Folder deleted" });
    refreshData();
  };
  
  const handleSelectDocument = (doc: Document) => {
    setCurrentDocument(doc.id);
    onDocumentSelect(doc);
  };
  
  return (
    <div className="space-y-1 py-2">
      <div className="flex items-center justify-between px-3 mb-2">
        <h3 className="text-sm font-medium text-sidebar-foreground/80">Documents</h3>
        <div className="flex space-x-1">
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setNewFolderDialog(true)}>
            <FolderIcon size={14} />
          </Button>
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setNewDocumentDialog(true)}>
            <Plus size={14} />
          </Button>
        </div>
      </div>
      
      {/* Folders and their documents */}
      <div className="mt-2">
        {/* Root documents */}
        {documents.filter(doc => !doc.folderId).map((doc) => (
          <div
            key={doc.id}
            className={`document-item ${doc.id === currentDocumentId ? 'active' : ''}`}
            onClick={() => handleSelectDocument(doc)}
          >
            <div className="flex items-center gap-2">
              <File size={14} />
              <span className="text-sm truncate">{doc.title}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreVertical size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleDeleteDocument(doc.id)}>
                  <Trash size={14} className="mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
        
        {/* Folders */}
        {folders.map((folder) => (
          <div key={folder.id}>
            <div className="folder-item" onClick={() => toggleFolder(folder.id)}>
              <FolderIcon size={16} />
              <span className="text-sm font-medium">{folder.name}</span>
              <div className="ml-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreVertical size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleDeleteFolder(folder.id)}>
                      <Trash size={14} className="mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {/* Documents in this folder */}
            {expandedFolders[folder.id] && documents
              .filter(doc => doc.folderId === folder.id)
              .map((doc) => (
                <div
                  key={doc.id}
                  className={`document-item ${doc.id === currentDocumentId ? 'active' : ''}`}
                  onClick={() => handleSelectDocument(doc)}
                >
                  <div className="flex items-center gap-2">
                    <File size={14} />
                    <span className="text-sm truncate">{doc.title}</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreVertical size={14} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDeleteDocument(doc.id)}>
                        <Trash size={14} className="mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            }
          </div>
        ))}
      </div>
      
      {/* New Document Dialog */}
      <Dialog open={newDocumentDialog} onOpenChange={setNewDocumentDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Document</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Document name"
              value={newDocumentName}
              onChange={(e) => setNewDocumentName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleCreateDocument}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* New Folder Dialog */}
      <Dialog open={newFolderDialog} onOpenChange={setNewFolderDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleCreateFolder}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
