import praw
from .parse_thread import parse_comment, parse_submission_post

def set_account():
    my_user_agent = ""
    my_client_id = ""
    my_client_secret = ""

    with open("credentials.txt") as f:
        for line in f:
            curr = line.split("=")
            if curr[0] == "user_agent":
                my_user_agent = curr[1].rstrip()
            elif curr[0] == "client_id":
                my_client_id = curr[1].rstrip()
            elif curr[0] == "client_secret":
                my_client_secret = curr[1].rstrip()

    return praw.Reddit(user_agent=my_user_agent,
                       client_id=my_client_id,
                       client_secret=my_client_secret)


r = set_account()


def crawl_thread(id):
    #check if id(always len of 6 // base36 notation) or url
    print("Value: " + id)
    # if len(id) != 6:
        # http://praw.readthedocs.io/en/praw4/pages/code_overview.html#praw.models.Submission.id_from_url
        # id = r.id_from_url(id)
    print("ID: " + id)

    thread = r.submission(id=id)

    return thread



def crawl_subreddit(id, sort='top'):
    num_of_threads_to_crawl = 5
    #check if id or name
    print("Value: " + id)

    sub = r.subreddit(id)

    # if sort == 'top':
    #     pass
    # elif sort == 'new':
    #     pass
    # elif sort == 'controversial':
    #     pass
    # elif sort == 'hot':
    #     pass

    data = {}

    for thread in sub.top(limit=num_of_threads_to_crawl):
        data[thread.id] = {
            "author": str(thread.author),
            "score": thread.score,
            "title": thread.title,
            "permalink": thread.permalink,
            "num_comments": thread.num_comments,
            "created_utc": thread.created_utc
        }

    return data


def crawl_comment(id):
    try:
        return r.comment(id).refresh()
    except:
        return r.submission(id)


def get_first_level(submission):
    level = []

    # print("get first level type", type(submission))
    # print(submission.id)
    # comments = submission.comments.replace_more()
    # for comment in comments:
    #     print("for loop",type(comment))
    #     level.append(parse_comment(comment))

    comments = submission.comments.replace_more()

    for comment in comments:
        # level.append(parse_comment(comment))

        level.append(comment)
    return level


def get_level(comment, id):
    level = []

    for child in comment.replies:
        if child.id != id:
            level.append(parse_comment(child))

    return level


def crawl_context(id):
    try:
        data = {}
        comment = crawl_comment(id)

        link_id = comment.link_id.split("_")[1]
        id = comment.parent_id.split("_")[1]

        #checks if parent is OP
        if id != link_id:
            parent = crawl_comment(id)
            id = parent.parent_id.split("_")[1]
        else:
            parent = r.submission(id)


        if id != link_id:
            parent_of_parent = crawl_comment(parent.parent_id.split("_")[1])

        # if 'parent' in locals():
        if not hasattr(parent, 'title'):
            data['parent'] = parse_comment(parent)
            data['siblings'] = get_level(parent, id)
        else:
            data['parent'] = parse_submission_post(parent)
            data['siblings'] = get_first_level(r.submission(id))
        # if 'parent_of_parent' in locals():
        #     data['parent_of_parent'] = parse_comment(parent_of_parent)
        # else:
        #     data['parent_of_parent'] = ""

        data['children'] = get_level(comment, id)

        return data
    except:

        comment = crawl_comment(id)

        data['parent'] = ""
        data['siblings'] = ""
        # data['parent_of_parent'] = ""

        children = []
        submission = r.submission(id)
        submission.comments.replace_more()
        for com in submission.comments:
            children.append(parse_comment(com))
        data['children'] = children
            # get_first_level(comment)

        return data


    #     raise KeyError("Can't crawl context of ORIGINAL POST")


"""

def contextv2(id):

    comment = crawl_comment(id)

    ends = 'https://oauth.reddit.com' + comment.permalink + '/.json?context=3'


    #3 ebenen drüber // parent_of_parent_of_parent
    top_comment = r.get('https://oauth.reddit.com/r/worldnews/comments/5f582t/switzerland_votes_to_keep_nuclear/dahpzol/.json?context=3')[1][0]

    #chaining // durch tree arbeiten
    initial_comment = top_comment.replies[0].replies[0].replies[0].body

"""