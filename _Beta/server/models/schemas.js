const schemas = {
    entry: {
        local_id: null,
        time_stamp: null,
        intiator: [],
        keywords: [],
        description: null,
        language: null,
        title: null,
        content: {}
    },
    chapter: {
        original_url: null,
        original_date: null,
        author: [],
        keywords: [],
        description: null,
        language: null,
        title: null,
        content: {}
    },
    media: {
        text: {
            char_count: null,
            word_count: null,
            url: null,
            content: null
        },
        image: {
            width: null,
            height: null,
            url: null,
            caption: null,
            alt_text: null
        },
        video: {
            width: null,
            height: null,
            url: null,
            duration: null,
            alt_text: null
        },
        audio: {
            width: null,
            height: null,
            url: null,
            duration: null,
            alt_text: null
        }
    }
};

module.exports = schemas;