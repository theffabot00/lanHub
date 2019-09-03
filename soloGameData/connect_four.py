

def solceck(row, col, tm, bord,tipe):
        b = int(1)
        amounts = [0,0,0,0,0,0,0,0]         ## 0 nd 1 are paired, 2 and 3 are paired etcetc
        index = 0                           ## i dont actually know which indicies do which directions
        cxb = 0
        cyb = 1
        for g in range(0,2):
            filler = cxb
            cxb = cyb
            cyb = filler
            for b in range(0,2):
                toget = 0
                cxb = -cxb
                cyb = -cyb
                propel = 1
                try:
                    while (bord[row + cyb*propel][col + cxb*propel].tm == tm):
                        propel += 1
                        toget += 1
                except IndexError:
                    pass
                amounts[index] = toget
                index += 1
        chang = 1
        for fgggsdgd in range(0,2):
            propel = 1
            toget = 0
            chang = -chang
            try:
                while (bord[row + chang*propel][col + chang*propel].tm == tm):
                    propel += 1
                    toget += 1
            except:
                pass
            amounts[index] = toget
            index += 1 
        chex = -1
        chey = 1
        for fgggsdgdgg in range(0,2):
            propel = 1
            toget = 0
            chex = -chex
            chey = -chey
            try:
                while (bord[row + chey*propel][col + chex*propel].tm == tm):
                    propel += 1
                    toget += 1
            except IndexError:
                pass
            amounts[index] = toget
            index += 1 
        if tipe == 0:        
            for x in range(0,4):
                if amounts[x*2] + amounts[(x*2 )+ 1] >= 3:
                    return True
            else:
                # print(amounts)
                return False
        if tipe == 1:
            for x in range(0,4):
                if amounts[x*2] + amounts[(x*2 )+ 1] >= 3:
                    return int(3)
            for x in range(0,4):
                if amounts[x*2] + amounts[(x*2 )+ 1] >= 2:
                    return int(2)
            for x in range(0,4):
                if amounts[x*2] + amounts[(x*2 )+ 1] >= 1:
                    return int(1)
            else:
                return int(0)        
def drop_test(col):
    row = 0
    for x in range(0,6):
        if x + 1 != 6:
            if (board[x+1][col].tm == "B"):
                row += 1
            else:
                x = 6
    return int(row)


        







class token(object):
    def __init__(self, color, column):
        
        self.tm = color
        if column == "neg":
            self.col = "filler"
        else:
            self.col = column
            self.row = drop_test(self.col)
            board[self.row][self.col] = self
    def solution_pls(self, board):
        return solceck(self.row,self.col,self.tm, board,0)

  

def btranslator(row):
    stringy =""
    for x in range(0,7):
        stringy = stringy + board[row][x].tm 
    return stringy
    
def printColumn(col):
    string = ""
    for n in range(0,6):
        string += board[n][col].tm
    return(string)

def board_printer():
    # print("\n" * 2 )
    # print("0 1 2 3 4 5 6")
    # for x in range(0,6):
    #     print(str(x) + btranslator(x)) 
    for x in range(0,7):
        #this is specially designed for the node thing; this is for my convenience and not for user friendliness
        print(str(x) + printColumn(x))
    

board = [[ token("B", "neg") for x in range(0,7)] for y in range(0,6)]
import random

who_won = ""
current_turn = 0
# board_printer()
while who_won == "":

    if current_turn == 0:
        try:
            #"\nIn which column would you like to place your token?\nColumn: "
            column_to_place = int(input())
            if (column_to_place < 0 or column_to_place > 7):
                literal_garbage = int("XDCRASH")
            if column_to_place == 7:
                break
            else:
                referabble = token("P",column_to_place)
                board[referabble.row][referabble.col] = referabble
                board_printer()
                if referabble.solution_pls(board):
                    print("9PLA")
                    break
                else:
                    print("9NOW")
                current_turn = 1
        except ValueError:
            print("Try a valid response!")
    if current_turn == 1:
        ##column initializing because reasons
        risk_values = [9,9,9,9,9,9,9]
        win_values = [9,9,9,9,9,9,9]
        filler_tokens = []
        brow = 0
        bcol = 0
        for x in range(0,7):   
            if board[1][x].tm == "B": 
                            ##in each column
                filler_tokens.append(token("B",x))   ## new token per column, its invis
                brow = filler_tokens[x].row
                bcol = filler_tokens[x].col

                board[brow][bcol] = token("P",x)
                risk_values[x] = solceck(brow,bcol,"P",board,1)
                board[brow][bcol] = token("B",x)

                board[brow][bcol] = token("X",x)
                win_values[x] = solceck(brow,bcol,"X",board,1)
                if solceck(brow,bcol,"X",board,1) == 3:
                    win_values[x] = win_values[x] + 1

                board[brow][bcol] = token("B",x)
      

            else:
                filler_tokens.append(token("B",x-1))
                win_values[x] = -99
                risk_values[x] = -99

        greatest = -1
        canrando = []

        col_scal = []
        for f in range(0,7):
            if board[0][f].tm == "B":
                if risk_values[f] > win_values[f]:
                    col_scal.append(risk_values[f])
                else:
                    col_scal.append(win_values[f])
            else:
               col_scal.append(-99) 


        for g in range(0,7):
            if risk_values[g] > greatest:
                greatest = risk_values[g]
        for b in range(0,7):
            if greatest == risk_values[b]:
                canrando.append(b)
        closest_to_win = canrando[random.randint(0,len(canrando)-1)]



        
        giggly = token("X", closest_to_win )
        board[giggly.row][giggly.col] = giggly
        board_printer()
        if solceck(giggly.row,giggly.col,"X",board,0):
            print("9BOT")
            break
        else:
            current_turn = 0



