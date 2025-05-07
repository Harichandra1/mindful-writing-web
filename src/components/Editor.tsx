
import { useEffect, useRef, useState } from "react";
import { Document, saveDocument } from "@/utils/localStorage";
import { useDebounce } from "../hooks/useDebounce";
import { toast } from "@/components/ui/use-toast";

interface EditorProps {
  document: Document | null;
  onDocumentChange: (document: Document) => void;
}

export default function Editor({ document, onDocumentChange }: EditorProps) {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const debouncedContent = useDebounce(content, 1000);
  const debouncedTitle = useDebounce(title, 1000);
  const editorRef = useRef<HTMLDivElement>(null);
  
  // Initialize editor with document
  useEffect(() => {
    if (document) {
      setContent(document.content);
      setTitle(document.title);
    } else {
      setContent("");
      setTitle("");
    }
  }, [document]);
  
  // Autosave content changes
  useEffect(() => {
    if (document && debouncedContent !== document.content) {
      const updatedDoc = {
        ...document,
        content: debouncedContent,
        updatedAt: new Date().toISOString(),
      };
      saveDocument(updatedDoc);
      onDocumentChange(updatedDoc);
      toast({ 
        title: "Document saved",
        description: "Your changes have been saved",
        duration: 1500
      });
    }
  }, [debouncedContent, document, onDocumentChange]);
  
  // Autosave title changes
  useEffect(() => {
    if (document && debouncedTitle !== document.title && debouncedTitle.trim() !== "") {
      const updatedDoc = {
        ...document,
        title: debouncedTitle,
        updatedAt: new Date().toISOString(),
      };
      saveDocument(updatedDoc);
      onDocumentChange(updatedDoc);
      toast({ 
        title: "Document title updated",
        duration: 1500
      });
    }
  }, [debouncedTitle, document, onDocumentChange]);
  
  // Focus on editor when document changes
  useEffect(() => {
    if (document && editorRef.current) {
      editorRef.current.focus();
    }
  }, [document]);
  
  if (!document) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-12">
        <p className="font-serif text-lg">Select a document or create a new one</p>
      </div>
    );
  }
  
  return (
    <div className="editor-container">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Untitled Document"
        className="text-2xl md:text-3xl font-serif font-medium border-none focus:outline-none bg-transparent w-full px-4 md:px-8 lg:px-16 py-4 mt-8 text-left"
        dir="ltr"
      />
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => setContent(e.currentTarget.textContent || "")}
        className="editor-content text-left"
        dir="ltr"
        style={{ direction: "ltr", textAlign: "left" }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
