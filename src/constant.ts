export const defalutData = {
    content:
        '北冥有鱼，其名为鲲。鲲之大，不知其几千里也；化而为鸟，其名为鹏。鹏之背，不知其几千里也；怒而飞，其翼若垂天之云。是鸟也，海运则将徙于南冥。南冥者，天池也。\n《齐谐》者，志怪者也。《谐》之言曰：“鹏之徙于南冥也，水击三千里，抟扶摇而上者九万里，去以六月息者也。”野马也，尘埃也，生物之以息相吹也。天之苍苍，其正色邪？其远而无所至极邪？其视下也，亦若是则已矣。且夫水之积也不厚，则其负大舟也无力。覆杯水于坳堂之上，则芥为之舟，置杯焉则胶，水浅而舟大也。风之积也不厚，则其负大翼也无力。故九万里，则风斯在下矣，而后乃今培风；背负青天，而莫之夭阏者，而后乃今将图南。蜩与学鸠笑之曰：“我决起而飞，抢榆枋而止，时则不至，而控于地而已矣，奚以之九万里而南为？”\n适莽苍者，三餐而反，腹犹果然；适百里者，宿舂粮；适千里者，三月聚粮。之二虫又何知！小知不及大知，小年不及大年。奚以知其然也？朝菌不知晦朔，蟪蛄不知春秋，此小年也。楚之南有冥灵者，以五百岁为春，五百岁为秋；上古有大椿者，以八千岁为春，八千岁为秋，此大年也。而彭祖乃今以久特闻，众人匹之，不亦悲乎！汤之问棘也是已。\n穷发之北，有冥海者，天池也。有鱼焉，其广数千里，未有知其修者，其名为鲲。有鸟焉，其名为鹏，背若泰山，翼若垂天之云，抟扶摇羊角而上者九万里，绝云气，负青天，然后图南，且适南冥也。斥鴳笑之曰：“彼且奚适也？我腾跃而上，不过数仞而下，翱翔蓬蒿之间，此亦飞之至也。而彼且奚适也？”此小大之辩也。\n故夫知效一官，行比一乡，德合一君，而征一国者，其自视也，亦若此矣。而宋荣子犹然笑之。且举世誉之而不加劝，举世非之而不加沮，定乎内外之分，辩乎荣辱之境，斯已矣。彼其于世，未数数然也。虽然，犹有未树也。夫列子御风而行，泠然善也，旬有五日而后反。彼于致福者，未数数然也。此虽免乎行，犹有所待者也。若夫乘天地之正，而御六气之辩，以游无穷者，彼且恶乎待哉？故曰：至人无己，神人无功，圣人无名。\n',
    labelCategories: [
        {
            id: 0,
            text: '名词',
            color: '#eac0a2',
            borderColor: '#a38671',
        },
        {
            id: 1,
            text: '动词',
            color: '#619dff',
            borderColor: '#436db2',
        },
        {
            id: 2,
            text: '形容词',
            color: '#9d61ff',
            borderColor: '#6d43b2',
        },
        {
            id: 3,
            text: '副词',
            color: '#ff9d61',
            borderColor: '#b26d43',
        },
    ],
    labels: [
        {
            id: 0,
            categoryId: 0,
            startIndex: 0,
            endIndex: 2,
        },
        {
            id: 1,
            categoryId: 0,
            startIndex: 3,
            endIndex: 4,
        },
        {
            id: 6,
            categoryId: 0,
            startIndex: 32,
            endIndex: 33,
        },
        {
            id: 7,
            categoryId: 1,
            startIndex: 46,
            endIndex: 47,
        },
        {
            id: 9,
            categoryId: 1,
            startIndex: 64,
            endIndex: 65,
        },
        {
            id: 10,
            categoryId: 0,
            startIndex: 217,
            endIndex: 218,
        },
        {
            id: 11,
            categoryId: 0,
            startIndex: 220,
            endIndex: 221,
        },
        {
            id: 12,
            categoryId: 2,
            startIndex: 218,
            endIndex: 219,
        },
        {
            id: 13,
            categoryId: 2,
            startIndex: 221,
            endIndex: 222,
        },
        {
            id: 14,
            categoryId: 0,
            startIndex: 79,
            endIndex: 81,
        },
        {
            id: 15,
            categoryId: 2,
            startIndex: 84,
            endIndex: 86,
        },
        {
            id: 16,
            categoryId: 0,
            startIndex: 191,
            endIndex: 192,
        },
        {
            id: 17,
            categoryId: 0,
            startIndex: 209,
            endIndex: 210,
        },
        {
            id: 18,
            categoryId: 2,
            startIndex: 190,
            endIndex: 191,
        },
    ],
    connectionCategories: [
        {
            id: 0,
            text: '修饰',
        },
        {
            id: 1,
            text: '限定',
        },
        {
            id: 2,
            text: '是...的动作',
        },
    ],
    connections: [
        {
            id: 0,
            categoryId: 2,
            fromId: 7,
            toId: 6,
        },
        {
            id: 3,
            categoryId: 2,
            fromId: 9,
            toId: 6,
        },
        {
            id: 4,
            categoryId: 0,
            fromId: 12,
            toId: 10,
        },
        {
            id: 5,
            categoryId: 0,
            fromId: 13,
            toId: 11,
        },
        {
            id: 6,
            categoryId: 0,
            fromId: 15,
            toId: 14,
        },
        {
            id: 7,
            categoryId: 0,
            fromId: 18,
            toId: 16,
        },
    ],
};
