USE `inet`;

-- users
INSERT INTO `user`
    (`username`, `password`, `name`, `avatar_url`)
VALUES
    ('user0', '$2a$10$ushVd/LnAQsV/7UrbAmzOOIScbMjWEYchllw8R9usFs0n6WLOeu4.', N'人類一號', 'https://avatarfiles.alphacoders.com/239/thumb-239745.png');

INSERT INTO `user`
    (`username`, `password`, `name`, `avatar_url`)
VALUES
    ('user1', '$2a$10$LI0vyuzA/9FolRnRYLfV9eQ4b5VxDFHAzyH3CM5y.gzBMyeTLjTEC', N'普通狗', 'https://www.dogalize.com/wp-content/uploads/2017/06/cat-300572_640-200x200.jpg');

INSERT INTO `user`
    (`username`, `password`, `name`, `avatar_url`)
VALUES
    ('user2', '$2a$10$nBjgHeAa4HWAzgoqL8EWN.1ZatbQIcsvyZQIiz5cX/sVNiVakPhU2', NULL, NULL);

-- article_categories
INSERT INTO `article_category`
    (`code`, `icon`, `index`)
VALUES
    ('animal', '🦒', 0);

INSERT INTO `article_category`
    (`code`, `icon`, `index`)
VALUES
    ('happy', '😃', 1);

INSERT INTO `article_category`
    (`code`, `icon`, `index`)
VALUES
    ('sad', '😢', 2);

INSERT INTO `article_category`
    (`code`, `icon`, `index`)
VALUES
    ('food', '🍣', 3);

INSERT INTO `article_category`
    (`code`, `icon`, `index`)
VALUES
    ('sports', '⚽', 4);

INSERT INTO `article_category`
    (`code`, `icon`, `index`)
VALUES
    ('knowledge', '📘', 5);

INSERT INTO `article_category`
    (`code`, `icon`, `index`)
VALUES
    ('poo', '💩', 7);

-- articles
INSERT INTO `article`
    (`category_id`, `author_id`, `cover_image_url`, `title`, `body`)
VALUES
    (1, 1, 'https://images.pexels.com/photos/825949/pexels-photo-825949.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', N'狗不只是人類最好的朋友，狗鼻子還能嗅出疾病味道、救我們一命？', N'犬隻一直被認為是人類最好的朋友，甚至有人認為牠們比人更適合作為心靈伴侶一起生活。隨著與犬隻的相處時間漸長，科學家發現可以透過訓練，利用牠們靈敏的嗅覺，嗅出人類的疾病並做出警示。目前全世界已經有越來越多相關的成功案例。\n其中科學家也以犬隻專責的工作領域，將工作犬做出區分，分別是初期疾病診斷的「醫療偵測犬」（medical detection dogs, MDD），以及在病患發病前做出警示的「醫療警報輔助犬」（medical alert/response assistance dogs）。\n怎麼發現犬隻的驚人能力？\n犬隻是群體生活的動物，牠們時常成群結隊一起行動，在相處過程中常透過觀察彼此的行為，或互相嗅聞氣味來了解同伴的身體是否出現異常狀況。犬隻鼻子的靈敏度很高，主要原因是牠們在呼吸時，吸進與呼出的空氣的通道不同，讓吸入的氣味分子能夠留在鼻腔，強化了犬隻分辨氣味的能力。這樣的獨特構造讓犬隻鼻子比人類靈敏，因此我們可以這樣說：狗用鼻子了解世界，將世界轉化成氣味的組合，如同人類用眼睛辨識物體，透過顏色、形狀、透視組合形成我們眼中的世界。\n最早被發現能夠對人類疾病做出偵測的犬隻，被收錄在1989年的英國醫學期刊《柳葉刀》（The Lancet）的一篇研究中。當時一名英國婦女告訴醫生她想要去除腿上的一顆痣，因為她的寵物犬對這顆痣非常有興趣，牠會一直湊到這顆痣旁邊又舔又聞，甚至不斷抓咬，為她的生活帶來困擾。完成手術後，檢驗結果讓醫生大吃一驚，原來這顆痣是癌細胞病變，若沒有及早發現與處理可能會危及性命！在此之後，越來越多類似的案例出現，讓研究人員對於犬隻的這項驚人能力產生興趣。');

INSERT INTO `article`
    (`category_id`, `author_id`, `cover_image_url`, `title`, `body`)
VALUES
    (1, 2, 'https://images.pexels.com/photos/1453478/pexels-photo-1453478.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', N'《潛意識正在控制你的行為》：狗最擅長解讀人類的社會訊號，更勝於我們的靈長類親戚', N'表情與肢體動作，透露出你不想顯露的訊息\n開車時曾被其他駕駛比過中指的人就會知道，非語言溝通十分明顯，很容易察覺。\n但有時當你的伴侶說：「不要這樣看我。」而你會回答：「不要怎樣看你？」你自以為把真正的感覺隱藏得很好。或者，有時你雖然咂著嘴稱讚另一半做的切達起司烤干貝很好吃，她卻仍回答：「什麼？你不喜歡？」別因此沮喪。倘若連馬都懂得察言觀色，你的另一半怎會不懂？\n科學家認為人類能用語言溝通，是非常了不起的成就。但我們也同時具有非語言溝通的能力，而且就算字斟句酌，這些溝通還是會透露更多訊息，甚至出賣我們。許多（甚至大部分）非語言訊息都是自動發生，不受意識控制的，因此這些訊息往往透露出我們真正的想法，但我們卻毫無所覺。我們的手勢、體態、臉上的表情，以及說話時悄悄流露出的態度，都會影響他人對我們的看法。\n人類與動物的互動，最能凸顯非語言訊息的力量，畢竟除非你活在皮克斯製作的電影裡，否則非人類動物無法完全理解人類的語言。但很多動物就跟漢斯一樣，對人類的手勢和肢體語言非常敏感。舉例來說，近來研究顯示，只要好好訓練，連狼都可以訓練成彷彿是像有禮貌的熟人，會回應人類的非語言訊號。當然你不會因此就把一匹狼取名「費多」（Fido，譯注：費多是電影《我家有個大屍兄》裡的殭屍主角。片中人類以特製項圈馴服殭屍，當僕人使喚），讓他陪你的一歲小孩玩。但狼的確是非常社會化的動物，牠能回應人類的非語言訊號，是因為狼的群體中原本就充斥著豐富的非語言訊息。狼可以預測、解讀同伴的肢體語言，牠們的許多群體行為，都仰賴這些能力。\n因此你若是狼，你會知道當同伴耳朵向前豎起，尾巴上揚，就表示牠在宣示主權；倘若耳朵向後揚，瞇著眼睛，表示牠起了疑心；倘若雙耳平貼，夾著尾巴，則表示牠很害怕。科學家尚未針對狼進行嚴謹的實驗，但這些行為似乎顯示，牠擁有某種程度心智理論的能力。當然，狼依舊不是人類最好的朋友，由狼演化而來的狗才是，而狗最擅長解讀人類的社會訊號，甚至勝於人類的靈長類親戚。\n這個發現讓許多人感到非常意外，畢竟靈長類動物更能勝任人類的其他技能，例如解決問題和說謊的能力。這個現象顯示在馴化的過程中，演化篩選出了那些心智狀態更適合陪伴人類的狗兒——這些狗於是得以享用人類的庇蔭和營火。\n在這些關於人類非語言溝通的研究中，有個實驗最具啟發，受試對象是一種人類甚少共享住所（如果有也不是故意的）的動物，那就是老鼠。在這項研究中，每個選修實驗心理學的學生，都收到五隻老鼠、一個T字形的迷宮，以及看似單純的任務。T字形迷宮的一邊是白色，另一邊是灰色。老鼠要學會爬向灰色那邊，成功的話就能得到獎賞。學生的任務是要每天給老鼠十次機會，學會到灰色區域取得食物。此外，學生也要客觀記錄下老鼠的所有學習過程。');

INSERT INTO `article`
    (`category_id`, `author_id`, `cover_image_url`, `title`, `body`)
VALUES
    (1, 3, 'https://images.pexels.com/photos/5257628/pexels-photo-5257628.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', N'狗狗為什麼會把屁股對著你？', N'家裡有養狗的人，一定遇到過狗屁屁面對自己的時候，不知道在挑釁，還是想給你看什麼？\n事實上，狗狗會把屁股對準你，大部分都帶有正向的涵義，例如對你表達信任和愛意（因為屁股是狗最沒有防備的部位）、想要保護你（狗在遇到敵人時，習慣背對背保護彼此），也可能是想把自己的味道留在你身上，藉此宣布主權。\n下一次狗狗把屁股對著你時，不如拍拍他，抱抱他，回應他對你的愛！');

-- article_likes
INSERT INTO `article_like`
    (`article_id`, `user_id`)
VALUES
    (1, 1);

INSERT INTO `article_like`
    (`article_id`, `user_id`)
VALUES
    (1, 2);

-- article_comments
INSERT INTO `article_comment`
    (`article_id`, `author_id`, `body`)
VALUES
    (1, 1, N'這篇文章寫得真好！');

INSERT INTO `article_comment`
    (`article_id`, `author_id`, `body`)
VALUES
    (1, 2, N'普通而已啦');

INSERT INTO `article_comment`
    (`article_id`, `author_id`, `body`)
VALUES
    (1, 1, N'我看你完全是不懂喔');

INSERT INTO `article_comment`
    (`article_id`, `author_id`, `body`)
VALUES
    (1, 3, N'dee dee do!');