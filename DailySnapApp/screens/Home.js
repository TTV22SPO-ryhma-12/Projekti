import { StyleSheet, View, Text, TextInput, Button, StatusBar, ScrollView, Image, TouchableOpacity} from 'react-native';
import { CameraComponent } from '../Components/camera';
import { fetchImages } from '../Firebase/FirebaseAuth';
import { useEffect, useState } from 'react';



export default function Home() {
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const openImage = (url) => {
        setSelectedImage(url);
        setModalVisible(true);
    };

    useEffect(() => {
        const fetchImagesFromFirebase = async () => {
            try {
                const fetchedImages = await fetchImages('allimages');
                setImages(fetchedImages);
            } catch (error) {
                console.error("Error fetching images:", error.message);
            }
        };
        fetchImagesFromFirebase();
    }, []);

    return (
        <View style={styles.home}>
            <Text>Tervetuloa kotisivulle</Text>
            <ScrollView style={styles.scroll}>
            {images.map((url, index) => (
                <TouchableOpacity key={index} onPress={() => openImage(url)}>
                <Image key={index} source={{ uri: url }} style={styles.image} />
                </TouchableOpacity>
            ))}
            </ScrollView>
        </View>
        
    )
}


const styles = StyleSheet.create({
    home: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    scroll: {
        width: "100%",
        
    },
    image: {
        width: "100%",
        height: 400,
        marginVertical: 5,
    },
})
