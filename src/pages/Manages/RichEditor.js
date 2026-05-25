import React, { useEffect, useRef } from "react";
import styles from "./RichEditor.module.css";

export default function RichEditor({ value, onChange, readOnly }) {
    const ref = useRef(null);
    const selRef = useRef(null);

    useEffect(() => {
        if (ref.current && ref.current.innerHTML !== value) {
            ref.current.innerHTML = value || "";
        }
    }, [value]);

    const saveSelection = () => {
        const sel = window.getSelection();
        if (sel.rangeCount > 0) selRef.current = sel.getRangeAt(0);
    };
    const restoreSelection = () => {
        const sel = window.getSelection();
        sel.removeAllRanges();
        if (selRef.current) sel.addRange(selRef.current);
    };
    const cmd = (c) => {
        restoreSelection();
        document.execCommand(c, false, null);
        ref.current?.focus();
    };

    return (
        <div className={styles.richEditorWrap}>
            {!readOnly && (
                <div className={styles.editorToolbar}>
                    {[
                        ["bold", "B"], ["italic", "I"], ["underline", "U"],
                        ["insertUnorderedList", "ul"], ["insertOrderedList", "ol"],
                        ["removeFormat", "×"]
                    ].map(([c, label]) => (
                        <button key={c} type="button"
                            className={styles.tbBtn}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => cmd(c)}
                        >{label}</button>
                    ))}
                </div>
            )}
            <div
                ref={ref}
                className={`${styles.richContent} ${readOnly ? styles.richReadOnly : ""}`}
                contentEditable={!readOnly}
                suppressContentEditableWarning
                onInput={(e) => onChange(e.currentTarget.innerHTML)}
                onMouseUp={saveSelection}
                onKeyUp={saveSelection}
                onBlur={saveSelection}
            />
        </div>
    );
}