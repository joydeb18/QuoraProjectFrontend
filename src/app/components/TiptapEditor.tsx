'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

// Toolbar ke buttons
const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  // Button ki styling ke liye ek helper function
  const buttonClass = (isActive: boolean) =>
    `px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
      isActive ? 'bg-gray-800 text-white' : 'bg-gray-200 hover:bg-gray-300'
    }`;

  return (
    <div className="border border-gray-300 rounded-t-lg p-2 flex flex-wrap gap-2 bg-gray-50">
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={buttonClass(editor.isActive('bold'))} type="button">Bold</button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={buttonClass(editor.isActive('italic'))} type="button">Italic</button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()} className={buttonClass(editor.isActive('strike'))} type="button">Strike</button>
      <button onClick={() => editor.chain().focus().setParagraph().run()} className={buttonClass(editor.isActive('paragraph'))} type="button">Paragraph</button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={buttonClass(editor.isActive('heading', { level: 1 }))} type="button">H1</button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={buttonClass(editor.isActive('heading', { level: 2 }))} type="button">H2</button>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={buttonClass(editor.isActive('bulletList'))} type="button">Bullet List</button>
      {/* === YEH NAYA BUTTON HAI === */}
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={buttonClass(editor.isActive('orderedList'))} type="button">Numeric List</button>
    </div>
  );
};

// Main Editor Component
const TiptapEditor = ({ content, onChange }: { content: string, onChange: (richText: string) => void }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    immediatelyRender: false, // SSR error se bachne ke liye
    editorProps: {
      attributes: {
        class: 'prose max-w-none p-4 focus:outline-none min-h-[250px] border-x border-b border-gray-300 rounded-b-lg',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;