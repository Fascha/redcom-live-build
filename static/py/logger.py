import os

path = os.path.abspath(os.path.join(os.path.dirname( __file__ ), '..', 'logs/test_20.csv'))
# print(path)
# path = '..\\logs\\sdest'
file = open(path, 'a+')


def write_action(log_string):
	with open(path, 'a+') as f:
		f.write(log_string + '\n')
		f.close()

