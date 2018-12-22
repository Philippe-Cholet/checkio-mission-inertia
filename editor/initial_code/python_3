from typing import Tuple, Iterable

def inertia(grid: Tuple[str], start: tuple) -> Iterable[str]:
    # your code here


if __name__ == '__main__':
    def checker(function, grid, start):
        result = function(grid, start)
        GEM, ROUGH, ICE, ROCK, MINE = '$. X*'
        MOVES = {'NW': (-1, -1), 'N': (-1, 0), 'NE': (-1, 1),
                  'W': ( 0, -1),                'E': ( 0, 1),
                 'SW': ( 1, -1), 'S': ( 1, 0), 'SE': ( 1, 1)}
        grid, (x, y) = list(map(list, grid)), start
        nb_rows, nb_cols = len(grid), len(grid[0])
        for nb, move in enumerate(result, 1):
            try:
                dx, dy = MOVES[move]
            except KeyError:
                print(f"I don't understand your {nb}-th move: '{move}'.")
                return False
            while 0 <= x + dx < nb_rows and 0 <= y + dy < nb_cols and \
                  grid[x + dx][y + dy] != ROCK:
                x, y = x + dx, y + dy
                if grid[x][y] == ROUGH:
                    break
                elif grid[x][y] == GEM:
                    grid[x][y] = ICE
                elif grid[x][y] == MINE:
                    print(f"You are dead at {(x, y)}, bye!")
                    return False
        try:
            coord = next((i, j) for i, row in enumerate(grid)
                                for j, cell in enumerate(row) if cell == GEM)
        except StopIteration:
            print(f"Great, you did it in {nb} moves!")
            return True
        print(f"You have at least forgot one gem at {coord}.")
        return False

    GRIDS = (('5x5', (1, 1), ('*X$$.',
                              ' .$*.',
                              '... X',
                              ' *$* ',
                              'XXX*$')),

             ('7x6', (6, 1), ('**$.  ',
                              '$*$.. ',
                              'X.**.$',
                              '*XX$ .',
                              '.X  XX',
                              'X$* X$',
                              '$.*  .')),

             ('5x10', (3, 8), (' X**$X.$X*',
                               '*$ X$.X*$.',
                               '* *X$..$$X',
                               '*.  .* *. ',
                               'X.$.XX $ .')))

    for dim, start, grid in GRIDS:
        assert checker(inertia, grid, start), f'You failed with the grid {dim}.'

    print('The local tests are done. Click on "Check" for more real tests.')
