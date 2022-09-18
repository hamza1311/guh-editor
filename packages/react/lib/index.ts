export * from '@guh-md/editor';

import type {EventName} from '@lit-labs/react';

import * as React from 'react';
import {createComponent} from '@lit-labs/react';
import { ChangeEvent, Editor } from '@guh-md/editor';

export const Guh = createComponent(
    React,
    'guh-editor',
    Editor,
    {
        onClick: 'pointerdown' ,
        onChange: 'change' as EventName<ChangeEvent>,
    }
);
