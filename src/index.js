import ApolloClient, { gql } from 'apollo-boost';
import 'dotenv/config';
import 'cross-fetch/polyfill';

const GET_ORG = gql`
    query($org: String!, $cursor: String) {
        organization(login: $org) {
            name
            url
            repositories(first: 10, after: $cursor, orderBy: { field: STARGAZERS, direction: ASC}) {
                edges {
                    node {
                        ...repoFields
                    }
                }
                totalCount
                pageInfo {
                    endCursor
                    hasNextPage
                }
            }
        }
    }

    fragment repoFields on Repository {
        name
        url
        stargazerCount
        viewerCanAdminister
    }
`;

const ADD_STAR = gql`
    mutation AddStar($repositoryId: ID!) {
        addStar(input: { starrableId: $repositoryId }) {
            starrable {
                id,
                viewerHasStarred
            }
        }
    }
`;

const REMOVE_STAR = gql`
    mutation RemoveStar($repositoryId: ID!) {
        removeStar(input: { starrableId: $repositoryId }) {
            starrable {
                id,
                viewerHasStarred
            }
        }
    }
`;

const client = new ApolloClient({
    uri: 'https://api.github.com/graphql',
    request: operation => {
        operation.setContext({
            headers: {
                authorization: `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`
            }
        })
    }
});

/* client
    .query({
        query: GET_ORG,
        variables: {
            org: 'facebook',
            cursor: 'Y3Vyc29yOnYyOpIbzgUtX6M='
        }
    })
    .then(d =>console.log(JSON.stringify(d)))
    .catch(console.error); */

    client
        .mutate({
            mutation: REMOVE_STAR,
            variables: {
                repositoryId: "MDEwOlJlcG9zaXRvcnkxMTg0MDQwMjQ="
            }
        })
        .then(console.log)