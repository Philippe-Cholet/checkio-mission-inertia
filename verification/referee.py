"""
CheckiOReferee is a base referee for checking you code.
    arguments:
        tests -- the dict contains tests in the specific structure.
            You can find an example in tests.py.
        cover_code -- is a wrapper for the user function and additional operations before give data
            in the user function. You can use some predefined codes from checkio.referee.cover_codes
        checker -- is replacement for the default checking of an user function result. If given, then
            instead simple "==" will be using the checker function which return tuple with result
            (false or true) and some additional info (some message).
            You can use some predefined codes from checkio.referee.checkers
        add_allowed_modules -- additional module which will be allowed for your task.
        add_close_builtins -- some closed builtin words, as example, if you want, you can close "eval"
        remove_allowed_modules -- close standard library modules, as example "math"
checkio.referee.checkers
    checkers.float_comparison -- Checking function fabric for check result with float numbers.
        Syntax: checkers.float_comparison(digits) -- where "digits" is a quantity of significant
            digits after coma.
checkio.referee.cover_codes
    cover_codes.unwrap_args -- Your "input" from test can be given as a list. if you want unwrap this
        before user function calling, then using this function. For example: if your test's input
        is [2, 2] and you use this cover_code, then user function will be called as checkio(2, 2)
    cover_codes.unwrap_kwargs -- the same as unwrap_kwargs, but unwrap dict.
"""

from checkio import api
from checkio.signals import ON_CONNECT
from checkio.referees.io import CheckiOReferee
from checkio.referees import cover_codes
#from checkio.referees import checkers

from tests import TESTS

GEM, ROUGH, ICE, ROCK, MINE = '$. X*'

MOVES = {'NW': (-1, -1), 'N': (-1, 0), 'NE': (-1, 1),
          'W': ( 0, -1),                'E': ( 0, 1),
         'SW': ( 1, -1), 'S': ( 1, 0), 'SE': ( 1, 1)}

def checker(answer, result):
    grid, (x, y) = answer
    grid = list(map(list, grid))
    nb_rows, nb_cols = len(grid), len(grid[0])
    for nb, move in enumerate(result, 1):
        try:
            dx, dy = MOVES[move]
        except KeyError:
            return False, f"I don't understand your {nb}-th move: '{move}'."
        while 0 <= x + dx < nb_rows and 0 <= y + dy < nb_cols and \
              grid[x + dx][y + dy] != ROCK:
            x, y = x + dx, y + dy
            if grid[x][y] == ROUGH:
                break
            elif grid[x][y] == GEM:
                grid[x][y] = ICE
            elif grid[x][y] == MINE:
                return False, f"You are dead at {(x, y)}, bye!"
    try:
        coord = next((i, j) for i, row in enumerate(grid)
                            for j, cell in enumerate(row) if cell == GEM)
    except StopIteration:
        return True, f"Great, you did it in {nb} moves!"
    return False, f"You have at least forgot one gem at {coord}."


cover_iterable = '''
def cover(func, in_data):
    return list(func(*map(tuple, in_data)))
'''

api.add_listener(
    ON_CONNECT,
    CheckiOReferee(
        tests = TESTS,
        checker = checker,
        function_name = {
            'python': 'inertia',
            'js': 'inertia'
            },
        cover_code = {
            'python-3': cover_iterable,
            'js-node': cover_codes.js_unwrap_args
            }
        ).on_ready
    )
