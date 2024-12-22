function SearchQuery(query: string, limit: number, page: number) {
  console.log(query);
  return `
  WITH search_data AS (
    SELECT
        id,
        title,
        description,
        tags,
        slug,
        card_poster,
        card_title,
        card_description,
        -- Concatenate title, description, and tags to create combined text
        title || ' ' || COALESCE(description, '') || ' ' || COALESCE(array_to_string(tags, ' '), '') AS combined_text
    FROM vertas.articals
),
search_query AS (
    SELECT
        unnest(string_to_array('${query}', ' ')) AS query -- Split input into words
)
SELECT
    id,
    title,
    description,
    tags,
    slug, -- Include slug in final SELECT
    card_poster, -- Include poster in final SELECT
    card_title, -- Include cardTitle in final SELECT
    card_description, -- Include cardDescription in final SELECT
    COUNT(*) AS match_count -- Count the number of matching words for each article
FROM search_data
JOIN search_query
    ON lower(combined_text) ILIKE '%' || lower(search_query.query) || '%' -- Perform case-insensitive match
GROUP BY
    id, title, description, tags, slug, card_poster, card_title, card_description
ORDER BY
    match_count DESC;
`;
}

export default SearchQuery;
