const connection = new signalR.HubConnectionBuilder()
    .withUrl(gameApiUri + "/signalr/games")
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Debug)
    .build();

/* The vue app, containing the visualisation, and the ui actions */
var vue = new Vue({
    el: '#arcmagegame',
    data: {
        useGrid: false,
        gapY: 50,
        gapX: 30,
        highlightPlayerHand: false,
        curtainLeftText: 'Waiting for your opponent&nbsp;',
        curtainRightText: 'to step into the arena...',
        showModal: false,
        searchValue: "",
        transformMatrix: {},
        inverseTransformMatrix: {},
        screenTransformMatrix: {},
        inverseScreenTransformMatrix: {},
        perspectiveDragOriginLeft: 0,
        perspectiveDragOriginTop: 0,
        perspectiveDragCssPostion: 'relative',
        previewImageSrc: "",
        preview: false,
        gameGuid: null,
        isStarted: false,
        coinflip: false,
        heads: true,
        diceRoll: false,
        cards: [],
        actions: [],
        player: {
            showCurtain: true,
            name: null,
            playerGuid: null,
            deckGuid: null,
            statsTimer: null,
            deck: [],
            play: [],
            hand: [],
            removed: [],
            graveyard: [],
            VictoryPoints: 15,
            resources: {
                black: { used: 0, available: 0 },
                yellow: { used: 0, available: 0 },
                green: { used: 0, available: 0 },
                blue: { used: 0, available: 0 },
                red: { used: 0, available: 0 },
            }
        },
        opponent: {
            name: "waiting...",
            showCurtain: true,
            playerGuid: null,
            deckGuid: null,
            statsTimer: null,
            deck: [],
            play: [],
            hand: [],
            removed: [],
            graveyard: [],
            VictoryPoints: 15,
            resources: {
                black: { used: 0, available: 0 },
                yellow: { used: 0, available: 0 },
                green: { used: 0, available: 0 },
                blue: { used: 0, available: 0 },
                red: { used: 0, available: 0 },
            }
        },
        cardlist: {
            show: false,
            cards: [],
            sync: {
                playerGuid: null,
                kind: null,
                mustsync: false,
            },
            oldIndex: -1,
        },
        services: {
            login: null,
            logout: null,
            users: null,
            cards: null,
            cardSearch: null,
            decks: null,
            deckSearch: null,
            deckCards: null,
            cardOptions: null,
            gameSearch: null,
            games: null,
            game: null,
        }

    },
    ready: function() {
      
        // create rest services
        this.createServices();
        // Add watcher for when the modal dialog closes,
        // - syncs the card visible state
        this.$watch('cardlist.show',
            function(value) {
                if (!value) {
                    vue.syncCardList();
                    setDroppableState(true);
                }
            });
        // Apply the layouting (matrix-3d transform, position victory point sliders)
        $(window).on('resize', function(e) { resizeGame(); }, 1000).resize();
        // Set up the droppable regions on the battlefield
        setupDropRegions();
        var i;
        for (i = 0; i < 90; i++) {
            this.actions.splice(0, 0, 'test ' + i);
        }


        // Start the game's BL
        $(init);
    },
    computed: {
        filteredCards: function() {
            var search = this.searchValue.toLowerCase();
            return this.cardlist.cards.filter(function(c) {
                if (search === "" || search.length < 3) return true;
                return c.name.toLowerCase().indexOf(search) >= 0 ||
                    c.ruleText.toLowerCase().indexOf(search) >= 0;
            });
        }
    },
    methods: {
        openCurtain: function() {
            vue.player.showCurtain = false;
            if (vue.isStarted) {
                sendGameAction({
                    gameGuid: vue.gameGuid,
                    playerGuid: vue.player.playerGuid,
                    actionType: 'changeCurtainState',
                    actionData: {
                        playerGuid: vue.player.playerGuid,
                        showCurtain: false
                    }
                });
            }
        },
        setCurtainState: function (player, state) {
            if (vue.isStarted) {
                sendGameAction({
                    gameGuid: vue.gameGuid,
                    playerGuid: vue.player.playerGuid,
                    actionType: 'changeCurtainState',
                    actionData: {
                        playerGuid: player.playerGuid,
                        showCurtain: state
                    }
                });
            }
        },
        openVideo: function() {
           // window.open("https://brie.fi/ng/arcmage_" + vue.gameGuid, "_blank");
		   window.open("https://meet.jit.si/arcmage_" + vue.gameGuid, "_blank");
        },
        openRules: function () {
            window.open(portalUri + "/arcmage/Game/pdfjs/web/viewer.html?file=" + portalUri + "/arcmage/Game/ArcmageRules.pdf", "_blank");
        },
        flipCoin: function() {
            if (!vue.coinflip) {
                sendGameAction({
                    gameGuid: vue.gameGuid,
                    playerGuid: vue.player.playerGuid,
                    actionType: 'flipCoin',
                });
            }
        },
        rollDice: function() {

            if (!vue.diceRoll) {
                sendGameAction({
                    gameGuid: vue.gameGuid,
                    playerGuid: vue.player.playerGuid,
                    actionType: 'diceRoll',
                });
            }
        },
        createServices: function() {
            this.services.login = this.$resource(apiUri + "/api/Login");
            this.services.logout = this.$resource(apiUri + "/api/Logout");
            this.services.users = this.$resource(apiUri + "/api/Users{/guid}");
            this.services.cards = this.$resource(apiUri + "/api/Cards{/guid}");
            this.services.cardSearch = this.$resource(apiUri + "/api/CardSearch");
            this.services.decks = this.$resource(apiUri + "/api/Decks{/guid}");
            this.services.deckSearch = this.$resource(apiUri + "/api/DeckSearch");
            this.services.deckCards = this.$resource(apiUri + "/api/DeckCards");
            this.services.cardOptions = this.$resource(apiUri + "/api/CardOptions{/guid}");
            this.services.deckOptions = this.$resource(apiUri + "/api/DeckOptions{/guid}");

            this.services.gameSearch = this.$resource(gameApiUri + "/api/GameSearch");
            this.services.games = this.$resource(gameApiUri + "/api/Games");
        },
        toggleMark: function(card) {
            sendGameAction({
                gameGuid: vue.gameGuid,
                playerGuid: vue.player.playerGuid,
                actionType: 'changeCardState',
                actionData: {
                    cardId: card.cardId,
                    isMarked: !card.isMarked,
                }
            });
        },
        toggleFaceDown: function(card) {
            sendGameAction({
                gameGuid: vue.gameGuid,
                playerGuid: vue.player.playerGuid,
                actionType: 'changeCardState',
                actionData: {
                    cardId: card.cardId,
                    isFaceDown: !card.isFaceDown,
                }
            });
        },
        increaseCounter: function(card, kind) {
            if (kind === 'counterA') {
                sendGameAction({
                    gameGuid: vue.gameGuid,
                    playerGuid: vue.player.playerGuid,
                    actionType: 'changeCardState',
                    actionData: {
                        cardId: card.cardId,
                        counterA: card.counterA + 1,
                    }
                });
            }
            if (kind === 'counterB') {
                sendGameAction({
                    gameGuid: vue.gameGuid,
                    playerGuid: vue.player.playerGuid,
                    actionType: 'changeCardState',
                    actionData: {
                        cardId: card.cardId,
                        counterB: card.counterB + 1,
                    }
                });
            }
        },
        decreaseCounter: function(card, kind) {
            if (kind === 'counterA') {
                var newCounterA = card.counterA - 1;
                if (newCounterA < 0) newCounterA = 0;
                sendGameAction({
                    gameGuid: vue.gameGuid,
                    playerGuid: vue.player.playerGuid,
                    actionType: 'changeCardState',
                    actionData: {
                        cardId: card.cardId,
                        counterA: newCounterA,
                    }
                });
            }
            if (kind === 'counterB') {
                var newCounterB = card.counterB - 1;
                if (newCounterB < 0) newCounterB = 0;
                sendGameAction({
                    gameGuid: vue.gameGuid,
                    playerGuid: vue.player.playerGuid,
                    actionType: 'changeCardState',
                    actionData: {
                        cardId: card.cardId,
                        counterB: newCounterB,
                    }
                });
            }
        },
        counterWheel: function(event, card, kind) {
            var e = window.event || event; // old IE support
            var delta = Math.max(-1, Math.min(1, -e.deltaY));
            if (delta > 0) {
                this.increaseCounter(card, kind);
            } else {
                this.decreaseCounter(card, kind);
            };
            return false;
        },
        moveCardFrom: function(actionType, fromPlayerGuid, fromKind, toPlayerGuid, toKind, isFaceDown, times = 1) {
            var i;
            for (i = 0; i < times; i++) {
                sendGameAction({
                    gameGuid: vue.gameGuid,
                    playerGuid: vue.player.playerGuid,
                    actionType: actionType,
                    actionData: {
                        fromPlayerGuid: fromPlayerGuid,
                        fromKind: fromKind,
                        toPlayerGuid: toPlayerGuid,
                        toKind: toKind,
                        cardState: {
                            isFaceDown: isFaceDown,
                        }
                    }
                });
            }
        },
        peekCard: function(event, card) {
            if (event.shiftKey && card.isFaceDown) {
                this.previewImageSrc = card.imageSrc;
                this.preview = true;
                card.isPeeking = true;
                // send game action peek card.
                sendGameAction({
                    gameGuid: vue.gameGuid,
                    playerGuid: vue.player.playerGuid,
                    actionType: 'changeCardState',
                    actionData: {
                        cardId: card.cardId,
                        isPeeking: true,
                    }
                });
              
            }
        },
        showPreview: function (card) {
            if (!card.isFaceDown) {
                this.previewImageSrc = card.imageSrc;
                this.preview = true;
            } else {
                this.preview = false;
            }
        },
        hidePreview: function (card) {
            this.preview = false;
            card.isPeeking = false;
            sendGameAction({
                gameGuid: vue.gameGuid,
                playerGuid: vue.player.playerGuid,
                actionType: 'changeCardState',
                actionData: {
                    cardId: card.cardId,
                    isPeeking: false,
                }
            });
        },
        increaseAvailableResource: function(playerGuid, resource) {
            if (resource.available < 99) {
                resource.available++;
                updatePlayerStatsAction(playerGuid);
            }
        },
        decreaseAvailableResource: function(playerGuid, resource) {
            if (resource.available > 0) {
                resource.available--;
                updatePlayerStatsAction(playerGuid);
            }
        },
        availableResourceWheel: function(event, playerGuid, resource) {
            var e = window.event || event; // old IE support
            var delta = Math.max(-1, Math.min(1, -e.deltaY));
            if (delta > 0) {
                this.increaseAvailableResource(playerGuid, resource);

            } else {
                this.decreaseAvailableResource(playerGuid, resource);
            };
            return false;
        },
        increaseUsedResource: function(playerGuid, resource) {
            if (resource.used < resource.available) {
                resource.used++;
                updatePlayerStatsAction(playerGuid);
            }
        },
        decreaseUsedResource: function(playerGuid, resource) {
            if (resource.used > 0) {
                resource.used--;
                updatePlayerStatsAction(playerGuid);
            }
        },
        usedResourceWheel: function(event, playerGuid, resource) {
            var e = window.event || event; // old IE support
            var delta = Math.max(-1, Math.min(1, -e.deltaY));
            if (delta > 0) {
                this.increaseUsedResource(playerGuid, resource);
            } else {
                this.decreaseUsedResource(playerGuid, resource);
            };
            return false;
        },
        playResourceCard: function(card, kind) {

            switch (kind) {
                case 'black':
                    vue.player.resources.black.used++;
                    vue.player.resources.black.available++;
                    break;
                case 'blue':
                    vue.player.resources.blue.used++;
                    vue.player.resources.blue.available++;
                    break;
                case 'red':
                    vue.player.resources.red.used++;
                    vue.player.resources.red.available++;
                    break;
                case 'green':
                    vue.player.resources.green.used++;
                    vue.player.resources.green.available++;
                    break;
                case 'yellow':
                    vue.player.resources.yellow.used++;
                    vue.player.resources.yellow.available++;
                    break;
            }

            sendGameAction({
                gameGuid: vue.gameGuid,
                playerGuid: vue.player.playerGuid,
                actionType: 'changePlayerStats',
                actionData: {
                    playerGuid: vue.player.playerGuid,
                    victoryPoints: vue.player.VictoryPoints,
                    resources: {
                        black: {
                            used: vue.player.resources.black.used,
                            available: vue.player.resources.black.available,
                        },
                        blue: {
                            used: vue.player.resources.blue.used,
                            available: vue.player.resources.blue.available,
                        },
                        red: {
                            used: vue.player.resources.red.used,
                            available: vue.player.resources.red.available,
                        },
                        green: {
                            used: vue.player.resources.green.used,
                            available: vue.player.resources.green.available,
                        },
                        yellow: {
                            used: vue.player.resources.yellow.used,
                            available: vue.player.resources.yellow.available,
                        }
                    }
                }
            });

            var totalResources =
                vue.player.resources.black.available +
                vue.player.resources.blue.available +
                vue.player.resources.red.available +
                vue.player.resources.green.available +
                vue.player.resources.yellow.available;

            var top = 1200 - 10 - 150 - 3 * totalResources;
            var left = 10 + 3 * totalResources;

            sendGameAction({
                gameGuid: vue.gameGuid,
                playerGuid: vue.player.playerGuid,
                actionType: 'playCard',
                actionData: {
                    fromPlayerGuid: vue.player.playerGuid,
                    fromKind: 'hand',
                    toPlayerGuid: vue.player.playerGuid,
                    toKind: 'play',
                    cardId: card.cardId,
                    cardState: {
                        cardId: card.cardId,
                        isFaceDown: true,
                        top: top,
                        left: left
                    }
                }
            });
        },
        shuffleCards: function (playerGuid, kind) {
            sendGameAction({
                gameGuid: vue.gameGuid,
                playerGuid: vue.player.playerGuid,
                actionType: 'shuffleList',
                actionData: {
                    playerGuid: playerGuid,
                    kind: kind,
                }
            });
        },
        unmarkAll: function(player) {
           
            var actionData = {
                playerGuid: player.playerGuid,
                kind: 'Play',
                cards: []
            };
            $.each(player.play, function (index, card) {
                card.isMarked = false;
                actionData.cards.push({
                    cardId: card.cardId,
                    isMarked: card.isMarked
                });
            });
            sendGameAction({
                gameGuid: vue.gameGuid,
                playerGuid: vue.player.playerGuid,
                actionType: 'updateList',
                actionData: actionData
            });
            vue.player.resources.black.used = vue.player.resources.black.available;
            vue.player.resources.blue.used = vue.player.resources.blue.available;
            vue.player.resources.red.used = vue.player.resources.red.available;
            vue.player.resources.green.used = vue.player.resources.green.available;
            vue.player.resources.yellow.used = vue.player.resources.yellow.available;

            sendGameAction({
                gameGuid: vue.gameGuid,
                playerGuid: vue.player.playerGuid,
                actionType: 'changePlayerStats',
                actionData: {
                    playerGuid: vue.player.playerGuid,
                    victoryPoints: vue.player.VictoryPoints,
                    resources: {
                        black: {
                            used: vue.player.resources.black.used,
                            available: vue.player.resources.black.available,
                        },
                        blue: {
                            used: vue.player.resources.blue.used,
                            available: vue.player.resources.blue.available,
                        },
                        red: {
                            used: vue.player.resources.red.used,
                            available: vue.player.resources.red.available,
                        },
                        green: {
                            used: vue.player.resources.green.used,
                            available: vue.player.resources.green.available,
                        },
                        yellow: {
                            used: vue.player.resources.yellow.used,
                            available: vue.player.resources.yellow.available,
                        }
                    }
                }
            });

        },

        showCardList: function (playerGuid, kind) {
            this.searchValue = "";                       
            setDroppableState(false);
            this.cardlist.sync.mustsync = true;
            this.cardlist.cards = [];
            this.cardlist.sync.playerGuid = playerGuid;
            this.cardlist.sync.kind = kind;
            var isFaceDown = kind !== 'graveyard';
            var list = getList(playerGuid, kind);
            $.each(list, function (index, card) {
                vue.cardlist.cards.push({
                    cardId: card.cardId,
                    name: card.name,
                    ruleText: card.ruleText,
                    imageSrc: card.imageSrc,
                    isFaceDown: isFaceDown,
                    isSelected: false,
                });
            });
            this.cardlist.cards.reverse();

            $("#cardlist").sortable({
                start: function (event, ui) {
                    vue.cardlist.oldIndex = ui.item.index();
                },
                //update: function (event, ui) {
                //    var newIndex = ui.item.index();
                //    vue.swapCards(vue.cardlist.cards, vue.cardlist.oldIndex, newIndex);
                //    vue.cardlist.oldIndex = newIndex;
                //},
                stop: function (event, ui) {
                    var newIndex = ui.item.index();
                    vue.swapCards(vue.cardlist.cards, vue.cardlist.oldIndex, newIndex);
                    vue.cardlist.oldIndex = newIndex;
                },
            });
            this.cardlist.show = true;
        },
        syncCardList: function () {
            if (!this.cardlist.sync.mustsync) return;
            var actionData = {
                playerGuid: this.cardlist.sync.playerGuid,
                kind: this.cardlist.sync.kind,
                cards: []
            };

            this.cardlist.cards.reverse();

            $.each(this.cardlist.cards, function (index, card) {
                actionData.cards.push({
                    cardId: card.cardId,
                    isFaceDown: card.isFaceDown
                });
            });
            sendGameAction({
                gameGuid: vue.gameGuid,
                playerGuid: vue.player.playerGuid,
                actionType: 'updateList',
                actionData: actionData
            });
            
        },
        selectFromCardList: function(card, event) {
            if (!event.ctrlKey) {
                $.each(this.cardlist.cards, function (index, card) {
                    card.isSelected = false;
                });
                card.isSelected = true;
            }
        },
        multiSelectFromCardList: function (card, event) {
            if (event.ctrlKey) {
                card.isSelected = !card.isSelected;
            }
        },
        setCardListFaceDown(faceDown) {
            $.each(this.cardlist.cards, function (index, card) {
                card.isFaceDown = faceDown;
            });
        },
        shuffleCardList: function () {
            var currentIndex = this.cardlist.cards.length, randomIndex;
            while (0 !== currentIndex) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                this.swapCards(this.cardlist.cards, currentIndex, randomIndex);
            }
        },
        swapCards: function (list, oldIndex, newIndex) {
            list.splice(newIndex, 0, list.splice(oldIndex, 1)[0]);
        },
        toggleCardListFaceDown: function(card) {
            card.isFaceDown = !card.isFaceDown;
        },
        cardlistDrawCard: function () {

            if (!(this.cardlist.sync.kind === 'hand' &&
                this.cardlist.sync.playerGuid === vue.player.playerGuid)) {

                var fromPlayerGuid = this.cardlist.sync.playerGuid;
                var fromKind = this.cardlist.sync.kind;

                $.each(this.cardlist.cards, function (index, card) {
                    if (card.isSelected) {
                        sendGameAction({
                            gameGuid: vue.gameGuid,
                            playerGuid: vue.player.playerGuid,
                            actionType: 'drawCard',
                            actionData: {
                                fromPlayerGuid: fromPlayerGuid,
                                fromKind: fromKind,
                                toPlayerGuid: vue.player.playerGuid,
                                toKind: 'hand',
                                cardId: card.cardId,
                                cardState: {
                                    cardId: card.cardId,
                                    isFaceDown: card.isFaceDown,
                                }
                            }
                        });
                    }
                });

               
                this.cardlist.sync.mustsync = false;
                this.cardlist.show = false;
            }
            
        },
        cardlistDiscardCard: function () {
            if (this.cardlist.sync.kind !== 'graveyard') {

                var playerGuid = this.cardlist.sync.playerGuid;
                var fromKind = this.cardlist.sync.kind;

                $.each(this.cardlist.cards, function(index, card) {
                    if (card.isSelected) {
                        sendGameAction({
                            gameGuid: vue.gameGuid,
                            playerGuid: vue.player.playerGuid,
                            actionType: 'discardCard',
                            actionData: {
                                fromPlayerGuid: playerGuid,
                                fromKind: fromKind,
                                toPlayerGuid: playerGuid,
                                toKind: 'graveyard',
                                cardId: card.cardId,
                                cardState: {
                                    cardId: card.cardId,
                                    isFaceDown: false,
                                }
                            }
                        });
                    }
                });
                this.cardlist.sync.mustsync = false;
                this.cardlist.show = false;
            }
            
        },
        cardlistPlayCard: function () {
            if (this.cardlist.sync.kind !== 'play') {

                var playerGuid = this.cardlist.sync.playerGuid;
                var fromKind = this.cardlist.sync.kind;

                $.each(this.cardlist.cards, function(index, card) {
                    if (card.isSelected) {
                        sendGameAction({
                            gameGuid: vue.gameGuid,
                            playerGuid: vue.player.playerGuid,
                            actionType: 'playCard',
                            actionData: {
                                fromPlayerGuid: playerGuid,
                                fromKind: fromKind,
                                toPlayerGuid: playerGuid,
                                toKind: 'play',
                                cardId: card.cardId,
                                cardState: {
                                    cardId: card.cardId,
                                    isFaceDown: card.isFaceDow,
                                }
                            }
                        });
                    }
                });
             
                this.cardlist.sync.mustsync = false;
                this.cardlist.show = false;
            }
            
        },
        cardlistDeckCard: function () {

            var playerGuid = this.cardlist.sync.playerGuid;
            var fromKind = this.cardlist.sync.kind;

            if (this.cardlist.sync.kind !== 'deck') {
                $.each(this.cardlist.cards, function(index, card) {
                    if (card.isSelected) {
                        sendGameAction({
                            gameGuid: vue.gameGuid,
                            playerGuid: vue.player.playerGuid,
                            actionType: 'deckCard',
                            actionData: {
                                fromPlayerGuid: playerGuid,
                                fromKind: fromKind,
                                toPlayerGuid: playerGuid,
                                toKind: 'deck',
                                cardId: card.cardId,
                                cardState: {
                                    cardId: card.cardId,
                                    isFaceDown: card.isFaceDow,
                                }
                            }
                        });
                    }
                });
                    
                this.cardlist.sync.mustsync = false;
                this.cardlist.show = false;
            }
            
        },
       
    },
   
});

/* Process game actions*/
function processGameAction(gameAction) {
    console.log(JSON.stringify(gameAction, null, 2));
    switch (gameAction.actionType) {
        case 'joinGame':
            break;
        case 'startGame':
            processStartGame(gameAction.actionResult);
            break;
        case 'drawCard':
        case 'discardCard':
        case 'playCard':
        case 'deckCard':
        case 'removeCard':
            if(vue.isStarted) {
                processMoveCard(gameAction.actionData);
            }
            break;
        case 'changeCardState':
            if (vue.isStarted) {
                var animate = gameAction.playerGuid === vue.opponent.playerGuid;
                processChangeCardState(gameAction.actionData, animate);
            }
            break;

        case 'changeCurtainState':
            if (vue.isStarted) {
                processChangeCurtainState(gameAction.actionData);
            }
            break;
        case 'changePlayerStats':
            if(vue.isStarted) {
                processChangePlayerStats(gameAction.actionData);
            } 
            break;
        case 'shuffleList':
            if (vue.isStarted) {
                processShuffleList(gameAction.actionData, gameAction.actionResult);
            } 
            break;
        case 'updateList':
            if (vue.isStarted) {
                processUpdateList(gameAction.actionData, gameAction.actionResult);
            } 
            break;
        case 'flipCoin':
            if (vue.isStarted) {
                processFlipCoin(gameAction.actionData, gameAction.actionResult);
            } 
            break;
        case 'diceRoll': 
            if (vue.isStarted) {
                processDiceRoll(gameAction.actionData, gameAction.actionResult);
            } 
            break;
        case 'leaveGame':
            if (vue.isStarted) {
                processLeave(gameAction);
            }
            break;

    }
}

function processLeave(gameAction) {
    var mustShow = gameAction.playerGuid === vue.opponent.playerGuid;
    if (mustShow) {
        vue.curtainLeftText = 'Your opponent&nbsp;';
        vue.curtainRightText= 'left the arena...';
        vue.isStarted = false;
        vue.player.showCurtain = true;
    }

}

/* Game bootstrap */
function init() {
    /* get the game id from the url */
    vue.gameGuid = $.urlParam('gameGuid');
    /* get the player id from the url */
    vue.player.playerGuid = $.urlParam('playerGuid');
    /* get the deck id from the url */
    vue.player.deckGuid = $.urlParam('deckGuid');
    vue.player.name =  $.urlParam('playerName');
    if (vue.player.name === undefined || vue.player.name === null) {
        vue.player.name = "Guest";
    }
    vue.player.name = decodeURIComponent(vue.player.name);

    window.onbeforeunload = function (e) {
        sendGameAction({
            gameGuid: vue.gameGuid,
            playerGuid: vue.player.playerGuid,
            actionType: 'leaveGame',
        });
        connection.close();
        /* $.connection.hub.stop(); */
    };

    
    /* set up the web push api, and send the join game action on completion */
    /* when the join is successful, the processGameAction callback is called every time an action happens in the game */
    /* using the sendGameAction method, a action can be triggered on all clients */
    /* setup callback for game actions*/
    /* $.connection.games.client.processAction = processGameAction; */

    connection.on("ProcessAction", (gameAction) => { 
        processGameAction(gameAction); 
    });


    /* open communications hub and join game when it is up */
    /* $.connection.hub.start().done(joinGame); */
    connectHub();
}

/* start the signalr connection */
async function connectHub(){
    try {
        await connection.start();
        joinGame();
    } catch (err) {
    }
}

/* trigger game action on all clients */
async function sendGameAction(gameAction) {
    /* $.connection.games.server.pushAction(gameAction); */
    try {
        await connection.invoke("PushAction", gameAction);
    } catch (err) {
        console.error(err);
    }
}

/* join the game */
async function joinGame() {

    try {
        await connection.invoke("JoinGame", vue.gameGuid, vue.player.playerGuid, vue.player.name);    
    } catch (err) {
        console.error(err);
    }

    sendGameAction({
        gameGuid: vue.gameGuid,
        playerGuid: vue.player.playerGuid,
        actionType: 'loadDeck',
        actionData: { deckGuid: vue.player.deckGuid }
    });

/*
    $.connection.games.server.joinGame(vue.gameGuid, vue.player.playerGuid, vue.player.name)
        .done(function() {
            sendGameAction({
                gameGuid: vue.gameGuid,
                playerGuid: vue.player.playerGuid,
                actionType: 'loadDeck',
                actionData: { deckGuid: vue.player.deckGuid }
            });
        });
*/
}



/* Region: game actions */

/* Action game start */
function loadDeck(source, target) {
   
    $.each(source.deck.cards, function (index, card) {
        var c = createCard(card);
        vue.cards.push(c);
        target.deck.push(c);
    });
    $.each(source.play.cards, function (index, card) {
        var c = createCard(card);
        vue.cards.push(c);
        target.play.push(c);
        updateCardLocation(c, c.top, c.left, false);
    });

   
}

function createCard(card) {
    var imageUrlBase = portalUri;
    return {
        cardId: card.cardId,
        name: card.name,
        imageSrc: imageUrlBase + card.url,
        isMarked: card.isMarked,
        isDraggable: card.isDraggable,
        isFaceDown: card.isFaceDown,
        top: card.top,
        left: card.left,
        counterA: card.counterA,
        counterB: card.counterB,
        animateCardMove: false,
        ruleText: card.ruleText,
        flavorText: card.flavorText,
        subType: card.subType,
        isCity: card.isCity,
        isToken: card.isToken,
        isPeeking: false
    };
}

function processStartGame(game) {
    var player = game.players.find(function (element) {
        return element.playerGuid === vue.player.playerGuid;
    });
    vue.player.name = player.name;
    loadDeck(player, vue.player);


    var opponent = game.players.find(function (element) {
        return element.playerGuid !== vue.player.playerGuid;
    });

    vue.opponent.playerGuid = opponent.playerGuid;
    vue.opponent.name = opponent.name;
    loadDeck(opponent, vue.opponent);

    setTimeout(function () {
        $("#player").css('background-image', 'url(' + player.avatar + ')');
        $("#opponent").css('background-image', 'url(' + opponent.avatar + ')');
        vue.isStarted = true;
        vue.curtainRightText = 'to open the blinds';
        vue.player.showCurtain = false;
        vue.opponent.showCurtain = false;
    }, 1500);

   
}

/* Action dice roll */
function processDiceRoll(actionData, actionResult) {

    var element = document.getElementById('dice-inner-container');
    vue.diceRoll = true;
    var numberOfDice = 1;
    var valuesToThrow = [ actionResult ];
    var options = {
        element, // element to display the animated dice in.
        numberOfDice, // number of dice to use 
        values: valuesToThrow, // values to throw. When provided, overides library generated values. Optional.
    }
    rollADie(options);
    setTimeout(function () {
        vue.diceRoll = false;
    }, 3000);
}

/* Action flip a coin */
function processFlipCoin(updateListParam, headsOrTails) {
    vue.heads = headsOrTails === "Heads";

    vue.coinflip = true;
    setTimeout(function () {
        vue.coinflip = false;
    }, 4000);
}

/* Action move card form one list to another */
function processMoveCard(moveCardParam) {
    /* Nothing to do if the move destination is the same as the source*/
    if (moveCardParam.fromPlayerGuid === moveCardParam.toPlayerGuid &&
        moveCardParam.fromKind === moveCardParam.toKind) {
        processChangeCardState(moveCardParam.cardState, false);
        return;
    }

    var source = getList(moveCardParam.fromPlayerGuid, moveCardParam.fromKind);
    var card;
    if (moveCardParam.cardId !== undefined) {
        card = source.find(function (element) {
            return element.cardId === moveCardParam.cardId;
        });
        source.$remove(card);
    } else {
        card = source.pop();
    }
    if (card) {
        var target = getList(moveCardParam.toPlayerGuid, moveCardParam.toKind);
        if (moveCardParam.index !== undefined && moveCardParam.index !== -1) {
            target.splice(moveCardParam.index, 0, card);
        } else {
            target.push(card);
        }
        if (moveCardParam.cardState !== undefined) {
            moveCardParam.cardState.cardId = card.cardId;
            processChangeCardState(moveCardParam.cardState, false);
        }
    }
}

/* Action update a card's state (location, mark/unmark, faceUp/faceDown) */
function updateCardLocation(card, top, left, animate) {

    

    card.animateCardMove = animate;
    

    var isPlayerCard = vue.player.play.find(function (element) {
        return element.cardId === card.cardId;
    });
    if (isPlayerCard !== undefined) {
        card.top = snapToGrid(top, vue.gapY);
        card.left = snapToGrid(left, vue.gapX);
    }

    var isOpponentCard = vue.opponent.play.find(function (element) {
        return element.cardId === card.cardId;
    });
    /* mirror the location using the battlefield line as mirroring line if it's an opponent card */
    if (isOpponentCard !== undefined) {
        card.top = 1200 - snapToGrid(top, vue.gapY) - 150;
        card.left = snapToGrid(left, vue.gapX);
    }
    if (isOpponentCard === undefined && isPlayerCard === undefined) {
        card.top = 0;
        card.left = 0;
    }
}

function snapToGrid(value, gap) {
    if (!vue.useGrid) return value;
    var modulus = value % gap;
    if (modulus < gap / 2) {
        return value - modulus;
    }
    return value - modulus + gap;
}

function processChangeCardState(state, animate) {
    var card = vue.cards.find(function (element) {
        return element.cardId === state.cardId;
    });
    if (card) {
        if (state.isMarked !== undefined) card.isMarked = state.isMarked;
        if (state.isDraggable !== undefined) card.isDraggable = state.isDraggable;
        if (state.isFaceDown !== undefined) card.isFaceDown = state.isFaceDown;
        if (state.counterA !== undefined) card.counterA = state.counterA;
        if (state.counterB !== undefined) card.counterB = state.counterB;
        if (state.isPeeking !== undefined) card.isPeeking = state.isPeeking;
        if (state.top !== undefined && state.left !== undefined) {
            updateCardLocation(card, state.top, state.left, animate);
        }
    }
}

/* Action update a player's stats (victory points, resources) */

/* updatePlayerStatsAction is a delayed triggered action, to bundle fast changes to 
  the resources/victory points of the player, before sending the action to all clients */
function updatePlayerStatsAction(playerGuid) {
    var player = getPlayer(playerGuid);
    if (player.statsTimer) {
        clearTimeout(player.statsTimer);
    }
    player.statsTimer = setTimeout(function () {
        sendGameAction({
            gameGuid: vue.gameGuid,
            playerGuid: vue.player.playerGuid,
            actionType: 'changePlayerStats',
            actionData: {
                playerGuid: player.playerGuid,
                victoryPoints: player.VictoryPoints,
                resources: {
                    black: {
                        used: player.resources.black.used,
                        available: player.resources.black.available,
                    },
                    blue: {
                        used: player.resources.blue.used,
                        available: player.resources.blue.available,
                    },
                    red: {
                        used: player.resources.red.used,
                        available: player.resources.red.available,
                    },
                    green: {
                        used: player.resources.green.used,
                        available: player.resources.green.available,
                    },
                    yellow: {
                        used: player.resources.yellow.used,
                        available: player.resources.yellow.available,
                    }
                }
            }
        });
    }, 1500);
}



function processChangeCurtainState(curtainState) {
    var player = getPlayer(curtainState.playerGuid);
    player.showCurtain = curtainState.showCurtain;
}


function processChangePlayerStats(playerState) {
    var player = getPlayer(playerState.playerGuid);
  
    player.resources.black.available = playerState.resources.black.available;
    player.resources.black.used = playerState.resources.black.used;
    player.resources.red.available = playerState.resources.red.available;
    player.resources.red.used = playerState.resources.red.used;
    player.resources.blue.available = playerState.resources.blue.available;
    player.resources.blue.used = playerState.resources.blue.used;
    player.resources.green.available = playerState.resources.green.available;
    player.resources.green.used = playerState.resources.green.used;
    player.resources.yellow.available = playerState.resources.yellow.available;
    player.resources.yellow.used = playerState.resources.yellow.used;
}

function processShuffleList(shuffleListParam, gamecards) {
    
    clearList(shuffleListParam.playerGuid, shuffleListParam.kind);
    var source = getList(shuffleListParam.playerGuid, shuffleListParam.kind);
    
    $.each(gamecards, function (index, gamecard) {
        var card = vue.cards.find(function (element) {
            return element.cardId === gamecard.cardId;
        });
        if (card !== undefined) {
            source.push(card);
        }
    });
}

function processUpdateList(updateListParam, gamecards) {

    if (updateListParam.kind === "Play") {

        // update the cards in play for the given player
        $.each(gamecards, function (index, gamecard) {
            processChangeCardState(gamecard, true);
        });
    } else {
        clearList(updateListParam.playerGuid, updateListParam.kind);
        var source = getList(updateListParam.playerGuid, updateListParam.kind);

        $.each(gamecards, function (index, gamecard) {
            var card = vue.cards.find(function (element) {
                return element.cardId === gamecard.cardId;
            });
            if (card !== undefined && card !== null) {
                card.isFaceDown = gamecard.isFaceDown;
                card.isMarked = gamecard.isMarked;
                card.isDraggable = gamecard.isDraggable;
                source.push(card);
            }
        });
    }
    // when dragging a card and updating a list at the same time, hand cards might have a top, left race condition.
    // this fixes that after the update
    $.each(vue.player.hand, function (index, gamecard) {
        processChangeCardState(
            {
                cardId: gamecard.cardId,
                top: 0,
                left:0,
            }, true);
    });

   
}

/* Region: helpers */
function getPlayer(playerGuid) {
    if (vue.player.playerGuid === playerGuid) return vue.player;
    if (vue.opponent.playerGuid === playerGuid) return vue.opponent;
    return null;
}

function clearList(playerGuid, kind) {
    var player = getPlayer(playerGuid);
    if (player) {
        switch (kind) {
            case 'deck':
                player.deck = [];
                break;
            case 'graveyard':
                player.graveyard = [];
                break;
            case 'hand':
                player.hand = [];
                break;
            case 'play':
                player.play = [];
                break;
            case 'removed':
                player.removed = [];
                break;
        }
    }
}

function getList(playerGuid, kind) {
    var player = getPlayer(playerGuid);
    if (!player) return null;
    switch (kind) {
        case 'deck':
            return player.deck;
        case 'graveyard':
            return player.graveyard;
        case 'hand':
            return player.hand;
        case 'play':
            return player.play;
        case 'removed':
            return player.removed;
        default:
            return null;
    }
}
/* EndRegion: helpers*/

/* EndRegion: game actions */

/* Region: droppables */

function setDroppableState(isEnabled) {
    var state = isEnabled ? "enable" : "disable";
    $("#battleFieldDrop").droppable(state);
    $("#playerHand").sortable(state);
    $("#playerDeck").droppable(state);
    $("#playerGraveyard").droppable(state);
    $("#opponentHand").droppable(state);
    $("#opponentDeck").droppable(state);
    $("#opponentGraveyard").droppable(state);
}

function setupDropRegions() {
    

    // Define playerhand as a drop target, when a card it dropped, change it in the datastructures
    //$("#playerHand").droppable({
    //    classes: {
    //        "ui-droppable-hover": "droptarget"
    //    },
    //    tolerance: 'perspectiveintersect',
    //    drop: function (event, ui) {
    //        var dragdata = $(ui.helper).data('dragdata');
    //        if (dragdata.dropped) return true;
    //        if (!(dragdata.fromPlayerGuid === vue.player.playerGuid && dragdata.fromKind === 'hand')) {
    //            sendGameAction({
    //                gameGuid: vue.gameGuid,
    //                playerGuid: vue.player.playerGuid,
    //                actionType: 'drawCard',
    //                actionData: {
    //                    fromPlayerGuid: dragdata.fromPlayerGuid,
    //                    fromKind: dragdata.fromKind,
    //                    toPlayerGuid: vue.player.playerGuid,
    //                    toKind: 'hand',
    //                    cardId: dragdata.item.cardId,
    //                    cardState: {
    //                        cardId: dragdata.item.cardId,
    //                        isFaceDown: false,
    //                        top: 0,
    //                        left: 0
    //                    }
    //                }
    //            });
    //        } else {
    //            dragdata.top = 0;
    //            dragdata.left = 0;
    //            dragdata.item.top = 0;
    //            dragdata.item.left = 0;
    //            $(ui.helper).css({ top: 0, left: 0 });
    //        }
    //        dragdata.dropped = true;
    //        return true;
    //    },
    //});

    //$("#playerHand").sortable({
    //    start: function(event, ui) {
    //        vue.player.hand.oldIndex = ui.item.index();
    //    },
    //    //update: function (event, ui) {
    //    //    var newIndex = ui.item.index();
    //    //    vue.swapCards(vue.cardlist.cards, vue.cardlist.oldIndex, newIndex);
    //    //    vue.cardlist.oldIndex = newIndex;
    //    //},
    //    stop: function(event, ui) {
    //        var newIndex = ui.item.index();
    //        vue.swapCards(vue.cardlist.cards, vue.cardlist.oldIndex, newIndex);
    //        vue.cardlist.oldIndex = newIndex;
    //    },
    //});

    $("#playerHand").sortable({
        //classes: {
        //    "ui-sortable": "droptarget"
        //},
        tolerance: 'perspectiveintersect',
       // tolerance: "pointer",
        start: function (event, ui) {
            var dragdata = $(ui.helper).data('dragdata');
            dragdata.oldIndex = vue.player.hand.findIndex(x => x.cardId === dragdata.item.cardId);
        },
        beforeStop: function (event, ui) {
            var dragdata = $(ui.helper).data('dragdata');
            if (dragdata.dropped) return true;
            if (!(dragdata.fromPlayerGuid === vue.player.playerGuid && dragdata.fromKind === 'hand')) {
                var index = -1;
                if (dragdata.fromKind === 'play') {
                    index = ui.item.index();
                    console.log('newindex: ' + index);
                }
                sendGameAction({
                    gameGuid: vue.gameGuid,
                    playerGuid: vue.player.playerGuid,
                    actionType: 'drawCard',
                    actionData: {
                        fromPlayerGuid: dragdata.fromPlayerGuid,
                        fromKind: dragdata.fromKind,
                        toPlayerGuid: vue.player.playerGuid,
                        toKind: 'hand',
                        cardId: dragdata.item.cardId,
                        index: index,
                        cardState: {
                            cardId: dragdata.item.cardId,
                            isFaceDown: false,
                            top: 0,
                            left: 0
                        }
                    }
                });
            } else {
                dragdata.top = 0;
                dragdata.left = 0;
                dragdata.item.top = 0;
                dragdata.item.left = 0;
                $(ui.helper).css({ top: 0, left: 0 });
                var newIndex = ui.item.index();
                vue.swapCards(vue.player.hand, dragdata.oldIndex, newIndex);
                console.log('oldindex: ' + dragdata.oldIndex + ' newindex: ' + newIndex + ' length: ' + vue.player.hand.length);
            }
            dragdata.dropped = true;
            return true;
        },
        // disable battelfield drop
        over: function (event, ui) {
            vue.highlightPlayerHand = true;
        },
        // enable battelfield drop
        out: function (event, ui) {
            vue.highlightPlayerHand = false;
        }
    });

    // Define opponenthand as a drop target, when a card it dropped, change it in the datastructures
    $("#opponentHand").droppable({
        classes: {
            "ui-droppable-hover": "droptarget"
        },
        tolerance: 'perspectiveintersect',
        drop: function (event, ui) {

            var dragdata = $(ui.helper).data('dragdata');
            if (dragdata.dropped) return true;
            if (!(dragdata.fromPlayerGuid === vue.opponent.playerGuid && dragdata.fromKind === 'hand')) {
                $(ui.helper).hide();
                dragdata.top = 0;
                dragdata.left = 0;
                dragdata.item.top = 0;
                dragdata.item.left = 0;
                $(ui.helper).css({ top: 0, left: 0 });
                sendGameAction({
                    gameGuid: vue.gameGuid,
                    playerGuid: vue.player.playerGuid,
                    actionType: 'drawCard',
                    actionData: {
                        fromPlayerGuid: dragdata.fromPlayerGuid,
                        fromKind: dragdata.fromKind,
                        toPlayerGuid: vue.opponent.playerGuid,
                        toKind: 'hand',
                        cardId: dragdata.item.cardId,
                        cardState: {
                            cardId: dragdata.item.cardId,
                            isFaceDown: false,
                            top: 0,
                            left: 0
                        }
                    }
                });

            }
            dragdata.dropped = true;
            return true;
        },
        // disable battelfield drop
        over: function (event, ui) {
  //          $("#battleField").droppable("disable");
        },
        // enable battelfield drop
        out: function (event, ui) {
  //          $("#battleField").droppable("enable");
        }
    });

    // Define player graveyard as a drop target, when a card it dropped, change it in the datastructures
    $("#playerGraveyard").droppable({
        classes: {
            "ui-droppable-hover": "droptarget"
        },
        tolerance: 'perspectiveintersect',
        drop: function (event, ui) {

            var dragdata = $(ui.helper).data('dragdata');
            if (dragdata.dropped) return true;
            if (!(dragdata.fromPlayerGuid === vue.player.playerGuid && dragdata.fromKind === 'graveyard')) {
                $(ui.helper).hide();
                dragdata.top = 0;
                dragdata.left = 0;
                dragdata.item.top = 0;
                dragdata.item.left = 0;
                $(ui.helper).css({ top: 0, left: 0 });
                sendGameAction({
                    gameGuid: vue.gameGuid,
                    playerGuid: vue.player.playerGuid,
                    actionType: 'discardCard',
                    actionData: {
                        fromPlayerGuid: dragdata.fromPlayerGuid,
                        fromKind: dragdata.fromKind,
                        toPlayerGuid: vue.player.playerGuid,
                        toKind: 'graveyard',
                        cardId: dragdata.item.cardId,
                        cardState: {
                            cardId: dragdata.item.cardId,
                            isFaceDown: false,
                            top: 0,
                            left: 0
                        }
                    }
                });

            }
            dragdata.dropped = true;
            return true;
        },
        // disable battelfield drop
        over: function (event, ui) {
  //          $("#battleField").droppable("disable");
        },
        // enable battelfield drop
        out: function (event, ui) {
  //          $("#battleField").droppable("enable");
        }
    });

    // Define player deck as a drop target, when a card it dropped, change it in the datastructures
    $("#playerDeck").droppable({
        classes: {
            "ui-droppable-hover": "droptarget"
        },
        tolerance: 'perspectiveintersect',
        drop: function (event, ui) {

            var dragdata = $(ui.helper).data('dragdata');
            if (dragdata.dropped) return true;
            if (!(dragdata.fromPlayerGuid === vue.player.playerGuid && dragdata.fromKind === 'deck')) {
                $(ui.helper).hide();
                dragdata.top = 0;
                dragdata.left = 0;
                dragdata.item.top = 0;
                dragdata.item.left = 0;
                $(ui.helper).css({ top: 0, left: 0 });
                sendGameAction({
                    gameGuid: vue.gameGuid,
                    playerGuid: vue.player.playerGuid,
                    actionType: 'deckCard',
                    actionData: {
                        fromPlayerGuid: dragdata.fromPlayerGuid,
                        fromKind: dragdata.fromKind,
                        toPlayerGuid: vue.player.playerGuid,
                        toKind: 'deck',
                        cardId: dragdata.item.cardId,
                        cardState: {
                            cardId: dragdata.item.cardId,
                            isFaceDown: true,
                            top: 0,
                            left: 0
                        }
                    }
                });

            }
            dragdata.dropped = true;
            return true;
        },
        // disable battelfield drop
        over: function (event, ui) {
  //          $("#battleField").droppable("disable");
        },
        // enable battelfield drop
        out: function (event, ui) {
   //         $("#battleField").droppable("enable");
        }
    });

    // Define opponent graveyard as a drop target, when a card it dropped, change it in the datastructures
    $("#opponentGraveyard").droppable({
        classes: {
            "ui-droppable-hover": "droptarget"
        },
        tolerance: 'perspectiveintersect',
        drop: function (event, ui) {

            var dragdata = $(ui.helper).data('dragdata');
            if (dragdata.dropped) return true;
            if (!(dragdata.fromPlayerGuid === vue.opponent.playerGuid && dragdata.fromKind === 'graveyard')) {
                $(ui.helper).hide();
                dragdata.top = 0;
                dragdata.left = 0;
                dragdata.item.top = 0;
                dragdata.item.left = 0;
                $(ui.helper).css({ top: 0, left: 0 });
                sendGameAction({
                    gameGuid: vue.gameGuid,
                    playerGuid: vue.player.playerGuid,
                    actionType: 'discardCard',
                    actionData: {
                        fromPlayerGuid: dragdata.fromPlayerGuid,
                        fromKind: dragdata.fromKind,
                        toPlayerGuid: vue.opponent.playerGuid,
                        toKind: 'graveyard',
                        cardId: dragdata.item.cardId,
                        cardState: {
                            cardId: dragdata.item.cardId,
                            isFaceDown: false,
                            top: 0,
                            left: 0
                        }
                    }
                });

            }
            dragdata.dropped = true;
            return true;
        },
        // disable battelfield drop
        over: function (event, ui) {
    //        $("#battleField").droppable("disable");
        },
        // enable battelfield drop
        out: function (event, ui) {
     //       $("#battleField").droppable("enable");
        }
    });

    // Define opponent deck as a drop target, when a card it dropped, change it in the datastructures
    $("#opponentDeck").droppable({
        classes: {
            "ui-droppable-hover": "droptarget"
        },
        tolerance: 'perspectiveintersect',
        drop: function (event, ui) {

            var dragdata = $(ui.helper).data('dragdata');
            if (dragdata.dropped) return true;
            if (!(dragdata.fromPlayerGuid === vue.opponent.playerGuid && dragdata.fromKind === 'deck')) {
                $(ui.helper).hide();
                dragdata.top = 0;
                dragdata.left = 0;
                dragdata.item.top = 0;
                dragdata.item.left = 0;
                $(ui.helper).css({ top: 0, left: 0 });
                sendGameAction({
                    gameGuid: vue.gameGuid,
                    playerGuid: vue.player.playerGuid,
                    actionType: 'deckCard',
                    actionData: {
                        fromPlayerGuid: dragdata.fromPlayerGuid,
                        fromKind: dragdata.fromKind,
                        toPlayerGuid: vue.opponent.playerGuid,
                        toKind: 'deck',
                        cardId: dragdata.item.cardId,
                        cardState: {
                            cardId: dragdata.item.cardId,
                            isFaceDown: true,
                            top: 0,
                            left: 0
                        }
                    }
                });

            }
            dragdata.dropped = true;
            return true;
        },
        // disable battelfield drop
        over: function (event, ui) {
      //      $("#battleField").droppable("disable");
        },
        // enable battelfield drop
        out: function (event, ui) {
    //        $("#battleField").droppable("enable");
        }
    });
    
    // Define the battelfield as a drop target, when a card it dropped, change it in the datastructures
    $("#battleFieldDrop").droppable({
        tolerance: 'perspectiveintersect',
        excludeRegions: [
            { name: '#playerDeck', top: 640, left: 1774, width: 106, height: 150 },
            { name: '#playerGraveyard', top: 850, left: 1774, width: 106, height: 150 },
            { name: '#opponentDeck', top: 410, left: 1774, width: 106, height: 150 },
            { name: '#opponentGraveyard', top: 200, left: 1774, width: 106, height: 150 },
            { name: '#opponentHand', top: 0, left: 800, width:320, height: 50 },
            { name: '#playerHand', top: 1105, left: 380, width: 1160, height: 95 }],
        drop: function (event, ui) {

            var dragdata = $(ui.helper).data('dragdata');
            if (dragdata.dropped) return true;
            if (dragdata.fromKind !== "play") {
                sendGameAction({
                    gameGuid: vue.gameGuid,
                    playerGuid: vue.player.playerGuid,
                    actionType: 'playCard',
                    actionData: {
                        fromPlayerGuid: dragdata.fromPlayerGuid,
                        fromKind: dragdata.fromKind,
                        toPlayerGuid: vue.player.playerGuid,
                        toKind: 'play',
                        cardId: dragdata.item.cardId,
                        cardState: {
                            cardId: dragdata.item.cardId,
                            isFaceDown: dragdata.item.isFaceDown,
                            top: snapToGrid(dragdata.top,vue.gapY),
                            left: snapToGrid(dragdata.left, vue.gapX)
                        }
                    }
                });
            } else {
                if (dragdata.fromPlayerGuid === vue.player.playerGuid) {
                    Vue.nextTick(function() {
                        sendGameAction({
                            gameGuid: vue.gameGuid,
                            playerGuid: vue.player.playerGuid,
                            actionType: 'changeCardState',
                            actionData: {
                                cardId: dragdata.item.cardId,
                                top: snapToGrid(dragdata.top, vue.gapY),
                                left: snapToGrid(dragdata.left, vue.gapX)
                            }
                        });
                    });
                   
                }
                if (dragdata.fromPlayerGuid === vue.opponent.playerGuid) {
                    sendGameAction({
                        gameGuid: vue.gameGuid,
                        playerGuid: vue.player.playerGuid,
                        actionType: 'changeCardState',
                        actionData: {
                            cardId: dragdata.item.cardId,
                            top: 1200 - snapToGrid(dragdata.top, vue.gapY) - 150,
                            left: snapToGrid(dragdata.left, vue.gapX)
                        }
                    });
                }
            }
            dragdata.dropped = true;
            return true;
        }
    });
}

/* EndRegion: droppables */
