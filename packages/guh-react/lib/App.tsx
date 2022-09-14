/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import 'guh';
import { EditorProps, ChangeEvent, Editor as GuhElement } from 'guh';
import { MutableRefObject, useEffect, useRef } from 'react';

interface Props extends EditorProps {
    // eslint-disable-next-line no-unused-vars
    onChange?: (e: ChangeEvent) => void
}

// eslint-disable-next-line no-unused-vars
const ifCurrent = (ref: MutableRefObject<GuhElement | undefined>, fn: (e: GuhElement) => void) => {
    if (ref.current) { fn(ref.current) }
}

function Guh(props: Props) {
    const editorRef = useRef<GuhElement>()

    useEffect(() => {
        const ref = editorRef.current;

        // eslint-disable-next-line no-unused-vars
        let handler: ((e: Event) => void) | undefined = undefined;
        if (props.onChange) {
            // typescript isn't smart enough to figure out the types
            handler = (e: Event) => props.onChange?.(e as unknown as ChangeEvent)
            ref?.addEventListener('change', handler)
        }

        return () => {
            if (handler) {
                ref?.removeEventListener('change', handler)
            }
        }
    }, [props.onChange])

    useEffect(() => {
        ifCurrent(editorRef, (ref) => {
            ref.autoFocus = props.autoFocus ?? false
        })
    }, [props.autoFocus])

    useEffect(() => {
        ifCurrent(editorRef, (ref) => {
            ref.readonly = props.readonly ?? false
        })
    }, [props.readonly])

    useEffect(() => {
        ifCurrent(editorRef, (ref) => {
            ref.extensions = props.extensions ?? []
        })
    }, [props.extensions])

    useEffect(() => {
        ifCurrent(editorRef, (ref) => {
            ref.value = props.value ?? ''
        })
    }, [props.value])

    useEffect(() => {
        ifCurrent(editorRef, (ref) => {
            ref.uploadMedia = props.uploadMedia
        })
    }, [props.uploadMedia])

    useEffect(() => {
        ifCurrent(editorRef, (ref) => {
            ref.theme = props.theme
        })
    }, [props.theme])

    // @typescript-eslint/ban-ts-comment
    // @ts-expect-error guh-editor is not in JSX.InstrinsicElements and I have no idea how to fix it
    return <guh-editor ref={editorRef} />;
}

export default Guh;
