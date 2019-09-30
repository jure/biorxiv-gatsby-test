create function prod.categories() returns table(category text, count bigint) as $$
  select collection, count(*) from prod.articles group by collection;
$$ language sql stable;

alter table prod.authors add primary key (id);
alter table prod.articles add primary key (id);
alter table prod.article_authors add constraint article_authors_authors_id_fkey foreign key (author) references prod.authors(id);
alter table prod.article_authors add constraint article_authors_articles_id_fkey foreign key (article) references prod.articles(id);

-- Denormalize authors from many to many to JSONB
alter table prod.articles
  add column authors jsonb;
  add column orcids jsonb;

update prod.articles set
  authors = to_jsonb(subq.authorarray)
from
(
  select ar.id, array_agg(a.name) as authorarray
	FROM prod.articles as ar
	LEFT JOIN prod.article_authors aa ON ar.id = aa.article
	LEFT JOIN prod.authors a ON aa.author = a.id
	GROUP BY ar.id
) as subq
where subq.id = prod.articles.id;

update prod.articles set
  orcids = to_jsonb(subq.authorarray)
from
(
  select ar.id, array_agg(a.orcid) as authorarray
	FROM prod.articles as ar
	LEFT JOIN prod.article_authors aa ON ar.id = aa.article
	LEFT JOIN prod.authors a ON aa.author = a.id
	GROUP BY ar.id
) as subq
where subq.id = prod.articles.id;