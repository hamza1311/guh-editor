# Guh Editor

Guh! A batteries included, embeddable markdown editor for the web.

Guh editor is built using [Lit](https://lit.dev) and is used as custom element.

## Usage

Install the NPM package:

```shell
npm install @guh-md/editor
# OR
yarn add @guh-md/editor
```

The package exports a custom element named `guh-editor`. Importing the package will also set up the custom element

```typescript
import '@guh-md/editor';
```

```html
<guh-editor></guh-editor>
```

## API

### Properties/Attributes

| Name          | Type                                          | Default            | Description                                                            |
|---------------|-----------------------------------------------|--------------------|------------------------------------------------------------------------|
| `value`       | `string`                                      | `''`               | The value of the editor                                                |
| `autoFocus`   | `boolean`                                     | `false`            | Indicates should the editor automatically have focus when it is loaded |
| `readonly`    | `boolean`                                     | `false`            | Indicates should the user be able to interact with the editor          |
| `uploadMedia` | `(files: File[]) => Promise<UploadedImage[]>` |                    | A callback which is called when image or video are to be uploaded.     |
| `extensions`  | `Extension[]`                                 | Default Extensions | Default CodeMirror extensions that are loaded                          |
| `theme`       | `Extension`                                   |                    | CodeMirror theme to use                                                |

### Styles

### Default extensions

Following CodeMirror extensions are loaded by default:
- `highlightSpecialChars`
- `history`
- `drawSelection`
- `dropCursor`
- `indentOnInput`
- `syntaxHighlighting`
- `bracketMatching`
- `closeBrackets`
- `autocompletion`
- `highlightSelectionMatches`
- `markdown`

#### Keymaps

`closeBracketsKeymap`
`standardKeymap`
`searchKeymap`
`historyKeymap`
`completionKeymap`

These extensions and keymaps can be overridden by specifying the `extentions` property. The exported constant, `DEFAULT_EXTENTIONS` can be used as a base for your extensions

### Media Uploads

When image or video files [^1] are either pasted or dragged and dropped onto the editor, `uploadMedia` callback is called. The callback must return an array of `UploadedMedia`.

```typescript
export interface UploadedMedia {
    url: string;
    alt: string;
}
```

[^1]: Any file with MIME type of `image/*` or `video/*`

### Styles

The editor comes with usable styles set out of the box. It is recommended to use this styles instead of providing a custom theme if possible. 
These styles can be customized with CSS variables:

| Name                        | Default   | Description                             |
|-----------------------------|-----------|-----------------------------------------|
| `--bg-color`                | `white`   | Background Color                        |
| `--cm-bg-color`             | `white`   | Editor wrapper background color         |
| `--editor-bg-color`         | `white`   | Editor background color                 |
| `--focused-outline-color`   | `blue`    | Color of outline when editor is focused |
| `--cm-min-height`           | `15rem`   | `min-height` the editor                 |
| `--cm-initial-height`       | `18rem`   | Initial height of the editor            |
| `--blockquote-border-color` | `#d0d7de` | Border color for quoted text            |
| `--blockquote-color`        | `#24292f` | Color of quoted text                    |


## License

The code is licensed under MIT.
