from flask import Flask, render_template
from flask_restful import Api, Resource

from static.py.crawl_data import *
from static.py.parse_thread import *


app = Flask(__name__)
api = Api(app)


class Thread(Resource):
    def get(self, id):
        if id not in crawled_threads.keys():
            crawled_threads[id] = crawl_thread(id)

        data_for_vis = "Hier sollen alle Daten für den ersten View geliefert werden!"

        data = parse_thread(crawled_threads[id])

        return data


class Context(Resource):
    def get(self, id):
        print("API called for COMMENT of ID: " + id)
        # print("Not implemented yet!")
        # raise NotImplementedError

        return crawl_context(id)


class Comment(Resource):
    def get(self, id):
        print("API called for COMMENT of ID: " + id)
        # print("Not implemented yet!")
        # raise NotImplementedError

        return parse_comment(crawl_comment(id))


class Subreddit(Resource):
    def get(self, id):
        print("API called for Subreddit of ID: " + id)
        # print("Not implemented yet!")
        # raise NotImplementedError

        return crawl_subreddit(id)


api.add_resource(Thread, '/get_thread/<id>')
api.add_resource(Context, '/get_context/<id>')
api.add_resource(Comment, '/get_comment/<id>')
api.add_resource(Subreddit, '/get_subreddit/<id>')


crawled_threads = {}


@app.route("/")
def index():
	#return render_template("tree_test.html")
    return render_template("index.html")


if __name__ == '__main__':
    app.run(debug=True)
