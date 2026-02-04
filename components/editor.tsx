'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { TextAlign } from '@tiptap/extension-text-align'
import { Link } from '@tiptap/extension-link'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Highlight } from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import { Button } from "@/components/ui/button"
import {
    Bold, Italic, Underline as UnderlineIcon, List, ListOrdered,
    Quote, Heading1, Heading2, Heading3, AlignLeft, AlignCenter,
    AlignRight, Link as LinkIcon, Code, ImagePlus
} from 'lucide-react'

interface EditorProps {
    content: string
    onChange: (html: string) => void
}

export function Editor({ content, onChange }: EditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Link.configure({
                openOnClick: false,
            }),
            TextStyle,
            Color,
            Highlight.configure({ multicolor: true }),
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
        ],
        content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[300px] p-4 border rounded-md',
            },
        },
    })

    if (!editor) {
        return null
    }

    const setLink = () => {
        const url = window.prompt('URL')
        if (url) {
            editor.chain().focus().setLink({ href: url }).run()
        }
    }

    const addImage = () => {
        const url = window.prompt('URL hình ảnh')
        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }

    return (
        <div className="border rounded-md">
            <div className="border-b p-2 flex gap-1 flex-wrap bg-muted/50">
                {/* Text Formatting */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? 'bg-muted' : ''}
                    type="button"
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive('italic') ? 'bg-muted' : ''}
                    type="button"
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={editor.isActive('underline') ? 'bg-muted' : ''}
                    type="button"
                >
                    <UnderlineIcon className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Headings */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}
                    type="button"
                >
                    <Heading1 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
                    type="button"
                >
                    <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={editor.isActive('heading', { level: 3 }) ? 'bg-muted' : ''}
                    type="button"
                >
                    <Heading3 className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Lists */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? 'bg-muted' : ''}
                    type="button"
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive('orderedList') ? 'bg-muted' : ''}
                    type="button"
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={editor.isActive('blockquote') ? 'bg-muted' : ''}
                    type="button"
                >
                    <Quote className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Alignment */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={editor.isActive({ textAlign: 'left' }) ? 'bg-muted' : ''}
                    type="button"
                >
                    <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={editor.isActive({ textAlign: 'center' }) ? 'bg-muted' : ''}
                    type="button"
                >
                    <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={editor.isActive({ textAlign: 'right' }) ? 'bg-muted' : ''}
                    type="button"
                >
                    <AlignRight className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Link & Code */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={setLink}
                    className={editor.isActive('link') ? 'bg-muted' : ''}
                    type="button"
                >
                    <LinkIcon className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={editor.isActive('codeBlock') ? 'bg-muted' : ''}
                    type="button"
                >
                    <Code className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={addImage}
                    type="button"
                >
                    <ImagePlus className="h-4 w-4" />
                </Button>
            </div>
            <EditorContent editor={editor} />
        </div>
    )
}
