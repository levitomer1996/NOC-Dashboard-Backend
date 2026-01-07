// src/opsgenie/tag-dictionary.ts

export type TagType = 'env' | 'metric' | 'provider' | 'generic';

export interface DictionaryTag {
    title: string;   // what you store as unique key
    type: TagType;
    env?: boolean;
    metric?: boolean;
}

export const TAG_DICTIONARY: DictionaryTag[] = [
    // ENV
    { title: 'env:prod', type: 'env', env: true },
    { title: 'env:stage', type: 'env', env: true },
    { title: 'env:dev', type: 'env', env: true },

    // METRICS
    { title: 'metric:bets', type: 'metric', metric: true },
    { title: 'metric:logins', type: 'metric', metric: true },
    { title: 'metric:registrations', type: 'metric', metric: true },

    // PROVIDERS (example)
    { title: 'provider:netent', type: 'provider' },
    { title: 'provider:evolution', type: 'provider' },
    { title: 'provider:ics', type: 'provider' },
];
