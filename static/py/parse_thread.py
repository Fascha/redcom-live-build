from math import log


def parse_comment(comment):

    try:
        data = {
            'id': comment.id,
            'author': str(comment.author),
            'body': comment.body,
            'score': comment.score,
            'permalink': comment.permalink(fast=True),
            'created_utc': comment.created_utc,
            'parent_id': comment.parent_id
        }
    except:
        data = parse_submission_post(comment)

    return data

def parse_submission_post(parent):
    try:
        child_id = parent.comments[0].id
    except:
        child_id = None
    data = {
        'id': parent.id,
        'author': str(parent.author),
        'body': parent.selftext,
        'score': parent.score,
        'permalink': parent.permalink,
        'created_utc': parent.created_utc,
        'title': parent.title,
        'parent_id': None,
        'child_id': child_id
    }

    return data


def parse_thread(thread):
    # replace all moreComments Objects
    # http://praw.readthedocs.io/en/praw4/pages/code_overview.html#praw.models.comment_forest.CommentForest.replace_more
    thread.comments.replace_more(limit=0)

    comment_ids = []
    comments = {}

    flattend_thread = thread.comments.list()
    total_comments = len(flattend_thread)
    upvote_ratio = thread.upvote_ratio

    for comment in thread.comments.list():
        id = comment.id
        comment_ids.append(id)

        replies = count_replies(comment.replies)
        score = comment.score
        ranking = calculate_ranking(total_comments, upvote_ratio, replies, score)
        ranking2 = calculate_ranking_2(total_comments, upvote_ratio, replies, score)

        comment = parse_comment(comment)
        comment['replies'] = replies
        comment['ranking'] = ranking
        comment['ranking2'] = ranking2

        comments[id] = comment

    return comments


def count_replies(comments):
    count = 0
    for comment in comments:
        count += 1
        count += count_replies(comment.replies)

    return count


# if (score * up_ratio) > 1:
#   (log(score * up_ratio * weighting) * (num_replies_other + 1)) / total_comments)
# else:
#   0
# up_ratio = thread.upvote_ratio
# total_comments = thread.num_comments

def calculate_ranking(total_comments, upvote_ratio, replies, score):
    weighting = 1
    if (score * upvote_ratio) > 1:
        return (log(score * upvote_ratio * weighting) * (replies + 1)) / total_comments
    else:
        return 0

def calculate_ranking_2(total_comments, upvote_ratio, replies, score):
    weighting = 1

    if (score * upvote_ratio) > 1:
        return score/total_comments
    else:
        return 0
