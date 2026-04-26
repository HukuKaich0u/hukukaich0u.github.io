# 特定の<hash>の時を一時的に確認しにいきたい時
# みてからそのままそこで作業したかったら、その場で git switch -c <branch>でブランチ
# を切る

### ignoredまで含むのであれば-aにする
git stash push -u -m "hogehoge"

git switch --detach <hash>

git switch <branch>

git stash list

### これで中身を確認してからでもいいね
git stash show -p stash@{number}

### listで確認してから何こめのやつを復元したいかで{number}をいじる
git stash apply stash@{0}

git stash drop stash@{@}

### stashの一番上にあるものを展開するコマンドで、コンフリクトに注意する
git stash pop
