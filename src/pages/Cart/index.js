import React from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Container, ViewProduct, ProductInfoView, ProductImage, DescriptionView, Title, Price, ButtonDelete, ActionsView, AmountText,
  ProductActionAndPriceView, TitleTotal, TotalPrice, UnitPrice, EndOrderButton,
  DetailProduct, TextBuyButton, List, EmptyCarView, EmptyCartImage, EmptyCarText,
  ButtonIncrement, ButtonDecrement
} from './styles';
import Header from '../../components/header';
import Icon from 'react-native-vector-icons/MaterialIcons'
import * as CartActions from '../../store/modules/cart/actions';
import api from '../../services/api';
import EmptyImage from '../../assets/emptycart.png'

function Cart({ cart, total, updateAmountRequest, deleteSuccess, totalCart }) {

  async function incrementProduct(product) {

    updateAmountRequest(product.id, product.amount + 1);

  }
  function decrementProduct(product) {

    updateAmountSuccess(product.id, product.amount - 1);
  }
  return (
    <Container>
      {(totalCart <= 0) ?
        <EmptyCarView>

          <EmptyCartImage source={EmptyImage} ></EmptyCartImage>
          <EmptyCarText>Seu carrinho está vazio!</EmptyCarText>
        </EmptyCarView> :

        <ViewProduct>
          <DetailProduct
            data={cart}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => {
              return (
                <List>
                  <ProductInfoView>
                    <ProductImage source={{ uri: item.image }}></ProductImage>
                    <DescriptionView>
                      <Title>{item.title}</Title>
                      <Price>{item.priceFormated}</Price>
                    </DescriptionView>
                    <ButtonDelete onPress={() => deleteSuccess(item.id)}>
                      <Icon name="delete-forever" size={30} color="#3c64ad"></Icon>

                    </ButtonDelete>

                  </ProductInfoView>
                  <ProductActionAndPriceView >
                    <ActionsView>
                      <ButtonIncrement onPress={() => incrementProduct(item)}>
                        <Icon name="add-circle-outline" size={25} color="#3c64ad" ></Icon>
                      </ButtonIncrement>

                      <AmountText>{item.amount}</AmountText>
                      <ButtonDecrement onPress={() => decrementProduct(item)}>
                        <Icon name="remove-circle-outline" size={25} color="#3c64ad"></Icon>
                      </ButtonDecrement>
                    </ActionsView>
                    <UnitPrice>{item.subtotal}</UnitPrice>
                  </ProductActionAndPriceView>
                </List>
              )

            }}
          ></DetailProduct>

          <TitleTotal>Total</TitleTotal>
          <TotalPrice>{String(total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TotalPrice>
          <EndOrderButton>
            <TextBuyButton>FINALIZAR PEDIDO</TextBuyButton>
          </EndOrderButton>

        </ViewProduct>
      }

    </Container>
  );

}

Cart.navigationOptions = {
  title: 'Cart',
  header: ({ navigation }) => <Header navigation={navigation} />,
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(CartActions, dispatch);
const mapStateToProps = state => ({
  cart: state.cart.map(product => ({
    ...product,
    subtotal: (product.amount * product.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }
  )),
  total: (state.cart.reduce((total, product) => {
    return (total + product.price * product.amount)
  }, 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
  totalCart: state.cart.length
});
export default connect(mapStateToProps, mapDispatchToProps)(Cart);
