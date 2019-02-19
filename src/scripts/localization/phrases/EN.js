export function phrasesEN() {
    return {
        'header': 'List of emails',
        'emails': 'E-mails',
        'addDate': 'Date added',
        'remove': 'delete',
        'add': function (email) {
            return `email ${email} added`
        },
        'delete': function (email) {
            return `email ${email} deleted`
        }
    }
}