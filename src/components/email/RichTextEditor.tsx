
import { Bold, Italic, Underline, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const handleCommand = (command: string) => {
    document.execCommand(command, false);
    const selection = document.getSelection();
    if (selection) {
      const content = selection.toString();
      // Update parent with new content
      onChange(content);
    }
  };

  return (
    <div className="border rounded-md">
      <div className="border-b p-2 flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleCommand("bold")}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleCommand("italic")}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleCommand("underline")}
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleCommand("createLink")}
        >
          <Link className="h-4 w-4" />
        </Button>
      </div>
      <div
        className="p-2 min-h-[200px]"
        contentEditable
        onInput={(e) => onChange(e.currentTarget.textContent || "")}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  );
};

export default RichTextEditor;
