export function phrasesRU() {
    return {
        'header': 'Список email-адресов',
        'email': 'Эл.почта',
        'addDate': 'Дата добавления',
        'remove': 'удалить',
        'add': function (email) {
            return `email ${email} добавлен`
        },
        'delete': function (email) {
            return `email ${email} удален`
        }
    }
}