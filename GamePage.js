import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Button, Alert, Vibration } from 'react-native';

const generateCardSet = (difficulty) => {
    const baseSet = ['😀', '🎉', '💖', '🍀', '🌈', '🎁', '🍎', '🏀', '🐶', '🦋', '🚗', '📚'];
    let setLength;

    switch (difficulty) {
        case 'easy': setLength = 6; break;
        case 'medium': setLength = 8; break;
        case 'hard': setLength = 12; break;
        default: setLength = 6;
    }

    const gameSet = baseSet.slice(0, setLength).flatMap(i => [i, i]);
    gameSet.sort(() => Math.random() - 0.5);

    return gameSet.map((face, index) => ({
        id: index,
        face,
        matched: false,
        flipped: false,
    }));
};

export default function GamePage({ route, navigation }) {
    const { difficulty } = route.params || { difficulty: 'easy' };
    const [cards, setCards] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);
    const [matches, setMatches] = useState(0);

    useEffect(() => {
        setCards(generateCardSet(difficulty));
    }, [difficulty]);

    useEffect(() => {
        if (matches * 2 === cards.length && cards.length > 0) {
            Alert.alert("Congratulations!", "You've won the game!", [{ text: "OK" }]);
        }
    }, [matches, cards.length]);

    const handlePress = (index) => {
        Vibration.vibrate(5); // Vibrates for 10 milliseconds on card press

        if (selectedCards.length === 2 || cards[index].flipped) return;

        const newCards = [...cards];
        newCards[index].flipped = true;
        setCards(newCards);

        const newSelectedCards = [...selectedCards, index];
        if (newSelectedCards.length === 2) {
            const firstCard = cards[newSelectedCards[0]];
            const secondCard = cards[newSelectedCards[1]];
            if (firstCard.face === secondCard.face) {
                setMatches(matches + 1);
                setCards(prevCards => prevCards.map(card =>
                    card.face === firstCard.face ? { ...card, matched: true, flipped: true } : card
                ));
                setSelectedCards([]);
            } else {
                setTimeout(() => {
                    setCards(prevCards => prevCards.map(card =>
                        newSelectedCards.includes(card.id) ? { ...card, flipped: false } : card
                    ));
                    setSelectedCards([]);
                }, 1000);
            }
        } else {
            setSelectedCards(newSelectedCards);
        }
    };

    const restartGame = () => {
        setCards(generateCardSet(difficulty));
        setSelectedCards([]);
        setMatches(0);
    };

    return (
        <View style={styles.container}>
            <View style={styles.cardsContainer}>
                {cards.map((card, index) => (
                    <TouchableOpacity
                        key={card.id}
                        style={[styles.card, card.flipped ? styles.flippedCard : styles.card]}
                        onPress={() => handlePress(index)}
                        disabled={card.matched}
                    >
                        <Text style={styles.cardText}>{card.flipped ? card.face : '❓'}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            {matches * 2 === cards.length && cards.length > 0 ? (
                <>
                    <Text style={styles.winMessage}>You Won! 🎉</Text>
                    <Button title="Back to Start" onPress={() => navigation.navigate('StartPage')} />
                </>
            ) : null}
            <Button title="Restart" onPress={restartGame} />
            <Text>Matches: {matches}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    cardsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 20,
    },
    card: {
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        backgroundColor: '#ccc',
        borderRadius: 8,
    },
    flippedCard: {
        backgroundColor: '#fff',
    },
    cardText: {
        fontSize: 28,
    },
    winMessage: {
        fontSize: 24,
        color: 'green',
        margin: 20,
    },
});
