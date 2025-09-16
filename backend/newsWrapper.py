import feedparser
from datetime import datetime


class Article:
    def __init__(self, title, link, published):
        self.title = title
        self.link = link
        self.published = published
        try:
            dt = datetime.strptime(published, "%a, %d %b %Y %H:%M:%S %z")
            self.hh_mm = dt.strftime("%H:%M")
        except Exception:
            self.hh_mm = ""
    
    def __dict__(self):
        return {
            'title': self.title,
            'link': self.link,
            'published': self.published,
            'hh_mm': self.hh_mm
        }
        
def load_news():
    articles = []
    # Ynet RSS feed URL
    rss_url = "https://www.ynet.co.il/Integration/StoryRss1854.xml"

    # Parse the RSS feed
    feed = feedparser.parse(rss_url)

    # Loop through each article
    for entry in feed.entries:
        article = Article(
            title=entry.title,
            link=entry.link,
            published=entry.published,
        )
        articles.append(article)
    
    return articles
# Ynet RSS feed URL

def compare_articles(old_articals: list[Article], new_articles: list[Article]):
    if old_articals is None or len(old_articals) == 0:
        return new_articles, new_articles
    for i, new_article in enumerate(new_articles):
        if new_article.link == old_articals[0].link:
            return i
    return len(new_articles)

def send_news(number_of_new_articals: int, articles: list[Article]):
    if number_of_new_articals == 0:
        return []
    return articles[:number_of_new_articals]