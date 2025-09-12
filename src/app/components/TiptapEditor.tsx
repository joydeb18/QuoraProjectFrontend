'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';

// Toolbar ke buttons
const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  // Button ki styling ke liye ek helper function
  const buttonClass = (isActive: boolean) =>
    `px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
      isActive ? 'text-white' : 'hover:opacity-80'
    }`;

  return (
    <div className="border rounded-t-lg p-2 flex flex-wrap gap-2" style={{backgroundColor: '#2E2E2E', borderColor: '#FF9800'}}>
      {/* Text Formatting */}
      <button 
        onClick={() => editor.chain().focus().toggleBold().run()} 
        className={buttonClass(editor.isActive('bold'))} 
        style={{backgroundColor: editor.isActive('bold') ? '#FF9800' : '#1E1E1E', color: '#FFFFFF'}}
        type="button"
      >
        <strong>B</strong>
      </button>
      <button 
        onClick={() => editor.chain().focus().toggleItalic().run()} 
        className={buttonClass(editor.isActive('italic'))} 
        style={{backgroundColor: editor.isActive('italic') ? '#FF9800' : '#1E1E1E', color: '#FFFFFF'}}
        type="button"
      >
        <em>I</em>
      </button>
      <button 
        onClick={() => editor.chain().focus().toggleStrike().run()} 
        className={buttonClass(editor.isActive('strike'))} 
        style={{backgroundColor: editor.isActive('strike') ? '#FF9800' : '#1E1E1E', color: '#FFFFFF'}}
        type="button"
      >
        <s>S</s>
      </button>
      
      {/* Headings */}
      <button 
        onClick={() => editor.chain().focus().setParagraph().run()} 
        className={buttonClass(editor.isActive('paragraph'))} 
        style={{backgroundColor: editor.isActive('paragraph') ? '#FF9800' : '#1E1E1E', color: '#FFFFFF'}}
        type="button"
      >
        P
      </button>
      <button 
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
        className={buttonClass(editor.isActive('heading', { level: 1 }))} 
        style={{backgroundColor: editor.isActive('heading', { level: 1 }) ? '#FF9800' : '#1E1E1E', color: '#FFFFFF'}}
        type="button"
      >
        H1
      </button>
      <button 
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
        className={buttonClass(editor.isActive('heading', { level: 2 }))} 
        style={{backgroundColor: editor.isActive('heading', { level: 2 }) ? '#FF9800' : '#1E1E1E', color: '#FFFFFF'}}
        type="button"
      >
        H2
      </button>
      <button 
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
        className={buttonClass(editor.isActive('heading', { level: 3 }))} 
        style={{backgroundColor: editor.isActive('heading', { level: 3 }) ? '#FF9800' : '#1E1E1E', color: '#FFFFFF'}}
        type="button"
      >
        H3
      </button>
      
      {/* Lists */}
      <button 
        onClick={() => editor.chain().focus().toggleBulletList().run()} 
        className={buttonClass(editor.isActive('bulletList'))} 
        style={{backgroundColor: editor.isActive('bulletList') ? '#FF9800' : '#1E1E1E', color: '#FFFFFF'}}
        type="button"
      >
        • List
      </button>
      <button 
        onClick={() => editor.chain().focus().toggleOrderedList().run()} 
        className={buttonClass(editor.isActive('orderedList'))} 
        style={{backgroundColor: editor.isActive('orderedList') ? '#FF9800' : '#1E1E1E', color: '#FFFFFF'}}
        type="button"
      >
        1. List
      </button>
      
      {/* Text Alignment */}
      <button 
        onClick={() => editor.chain().focus().setTextAlign('left').run()} 
        className={buttonClass(editor.isActive({ textAlign: 'left' }))} 
        style={{backgroundColor: editor.isActive({ textAlign: 'left' }) ? '#FF9800' : '#1E1E1E', color: '#FFFFFF'}}
        type="button"
      >
        ←
      </button>
      <button 
        onClick={() => editor.chain().focus().setTextAlign('center').run()} 
        className={buttonClass(editor.isActive({ textAlign: 'center' }))} 
        style={{backgroundColor: editor.isActive({ textAlign: 'center' }) ? '#FF9800' : '#1E1E1E', color: '#FFFFFF'}}
        type="button"
      >
        ↔
      </button>
      <button 
        onClick={() => editor.chain().focus().setTextAlign('right').run()} 
        className={buttonClass(editor.isActive({ textAlign: 'right' }))} 
        style={{backgroundColor: editor.isActive({ textAlign: 'right' }) ? '#FF9800' : '#1E1E1E', color: '#FFFFFF'}}
        type="button"
      >
        →
      </button>
      
      {/* Colors */}
      <button 
        onClick={() => editor.chain().focus().setColor('#FF9800').run()} 
        className={buttonClass(editor.isActive('textStyle', { color: '#FF9800' }))} 
        style={{backgroundColor: editor.isActive('textStyle', { color: '#FF9800' }) ? '#FF9800' : '#1E1E1E', color: '#FF9800'}}
        type="button"
      >
        🟠
      </button>
      <button 
        onClick={() => editor.chain().focus().setColor('#4CAF50').run()} 
        className={buttonClass(editor.isActive('textStyle', { color: '#4CAF50' }))} 
        style={{backgroundColor: editor.isActive('textStyle', { color: '#4CAF50' }) ? '#FF9800' : '#1E1E1E', color: '#4CAF50'}}
        type="button"
      >
        🟢
      </button>
      <button 
        onClick={() => editor.chain().focus().setColor('#2196F3').run()} 
        className={buttonClass(editor.isActive('textStyle', { color: '#2196F3' }))} 
        style={{backgroundColor: editor.isActive('textStyle', { color: '#2196F3' }) ? '#FF9800' : '#1E1E1E', color: '#2196F3'}}
        type="button"
      >
        🔵
      </button>
      <button 
        onClick={() => editor.chain().focus().setColor('#F44336').run()} 
        className={buttonClass(editor.isActive('textStyle', { color: '#F44336' }))} 
        style={{backgroundColor: editor.isActive('textStyle', { color: '#F44336' }) ? '#FF9800' : '#1E1E1E', color: '#F44336'}}
        type="button"
      >
        🔴
      </button>
      <button 
        onClick={() => editor.chain().focus().setColor('#9C27B0').run()} 
        className={buttonClass(editor.isActive('textStyle', { color: '#9C27B0' }))} 
        style={{backgroundColor: editor.isActive('textStyle', { color: '#9C27B0' }) ? '#FF9800' : '#1E1E1E', color: '#9C27B0'}}
        type="button"
      >
        🟣
      </button>
      
      {/* Highlight */}
      <button 
        onClick={() => editor.chain().focus().toggleHighlight({ color: '#FFEB3B' }).run()} 
        className={buttonClass(editor.isActive('highlight'))} 
        style={{backgroundColor: editor.isActive('highlight') ? '#FF9800' : '#1E1E1E', color: '#FFEB3B'}}
        type="button"
      >
        ✨
      </button>
      
      {/* Clear Formatting */}
      <button 
        onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} 
        className={buttonClass(false)} 
        style={{backgroundColor: '#1E1E1E', color: '#FFFFFF'}}
        type="button"
      >
        Clear
      </button>
    </div>
  );
};

// Main Editor Component
const TiptapEditor = ({ content, onChange }: { content: string, onChange: (richText: string) => void }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: content,
    immediatelyRender: false, // SSR error se bachne ke liye
    editorProps: {
      attributes: {
        class: 'prose max-w-none p-4 focus:outline-none min-h-[300px] border-x border-b rounded-b-lg',
        style: 'background-color: #2E2E2E; color: #FFFFFF; border-color: #FF9800;',
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