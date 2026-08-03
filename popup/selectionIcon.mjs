export function shouldShowDeleteIcon (mode, inputType) {
    return mode === 'always'
        || (mode === 'mixed' && inputType === 'mouse')
}
